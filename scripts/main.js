import { MODULE_METADATA, HOOK_EVENTS } from "./config/constants.js";
import { logger } from "./utils/Logger.js";
import { getGame } from "./utils/GameInstance.js";
import { SemverUtils } from "./utils/SemverUtils.js";
import { ModuleSettings } from "./settings/ModuleSettings.js";
import { MigrationManager } from "./migrations/MigrationManager.js";
import { MigrationV1 } from "./migrations/migrations/MigrationV1.js";
import { MigrationV2 } from "./migrations/migrations/MigrationV2.js";
import { NoticeManager } from "./notices/NoticeManager.js";
import { chatProxy } from "./utils/ChatProxy.js";
import { WeatherController } from "./controller/WeatherController.js";
import { DateObjectFactory } from "./calendar/DateObjectFactory.js";
import { CalendarAPI, CALENDAR_PROVIDER } from "./calendar/CalendarAPI.js";

let controller = null;
let initialized = false;

function warnIfNoCalendarModule() {
  const active = CalendarAPI.getActiveSupportedModules();
  if (active.length > 0) return true;

  const message = game.i18n.localize("wctrl.misc.CalendarMissing");
  console.warn(message);
  ui.notifications.warn(message);
  return false;
}

function checkSimpleCalendarVersionIfUsed() {
  if (!CalendarAPI.isSimpleCalendarFamilyActive()) return true;

  const required = "v1.3.73";
  const game = getGame();
  const original = game.modules.get("foundryvtt-simple-calendar");
  const reborn = game.modules.get("foundryvtt-simple-calendar-reborn");

  if (reborn?.active) return true;

  const current = original?.data?.version ?? original?.version;
  if (!current) return true;

  return SemverUtils.isMoreRecent(current, required) || current === required;
}

function bindProviderHooks(provider) {
  if (provider === CALENDAR_PROVIDER.SIMPLE_CALENDAR) {
    Hooks.on(HOOK_EVENTS.DateTimeChange, ({ date }) => {
      const dateObject = DateObjectFactory.createDateObject(date);
      controller.onDateTimeChange(dateObject);
    });

    Hooks.on(HOOK_EVENTS.ClockStartStop, () => {
      controller.onClockStartStop();
    });
    return;
  }

  if (provider === CALENDAR_PROVIDER.SEASONS_AND_STARS) {
    Hooks.on(HOOK_EVENTS.SeasonsStarsDateChanged, (data) => {
      const dateObject = DateObjectFactory.createFromSeasonsStarsDate(
        data?.newDate,
      );
      controller.onDateTimeChange(dateObject);
    });

    Hooks.on(HOOK_EVENTS.SeasonsStarsTimeAdvancementStarted, () => {
      CalendarAPI.setSeasonsStarsAdvancing(true);
      controller.onClockStartStop();
    });

    Hooks.on(HOOK_EVENTS.SeasonsStarsTimeAdvancementPaused, () => {
      CalendarAPI.setSeasonsStarsAdvancing(false);
      controller.onClockStartStop();
    });
  }
}

function initializeWeatherControl() {
  if (initialized) return false;

  const provider = CalendarAPI.resolveProvider();
  if (!provider) return false;

  initialized = true;
  logger.info(`Weather Control initializing with calendar provider: ${provider}`);

  const game = getGame();
  const settings = new ModuleSettings(game);

  if (game.user.isGM) {
    const noticeManager = new NoticeManager(game, settings);
    void noticeManager.checkForNotices();
  }

  const migrationManager = new MigrationManager();
  migrationManager.register(new MigrationV1());
  migrationManager.register(new MigrationV2());

  const data = settings.getWeatherData();
  const migrated = migrationManager.run(data.version, data);

  const maybePromise =
    migrated &&
    (logger.info("Saving migrated data"), settings.setWeatherData(migrated));

  Promise.resolve(maybePromise).then(() => {
    controller = new WeatherController(game, chatProxy, settings);
    bindProviderHooks(provider);
    controller.onReady();
  });

  return true;
}

Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(MODULE_METADATA.id, "level");

  const game = getGame();
  const devModule = game.modules.get("_dev-mode");

  try {
    logger.registerLevelCheckCallback(() => {
      return devModule?.api?.getPackageDebugValue(
        MODULE_METADATA.id,
        "level",
      );
    });
  } catch (err) {
    // Ignore; dev mode is optional
  }
});

Hooks.once("ready", () => {
  if (!warnIfNoCalendarModule()) return;

  if (!checkSimpleCalendarVersionIfUsed()) {
    ui.notifications.warn(
      "Weather Control: Simple Calendar version may be below v1.3.73. Consider upgrading, or use Simple Calendar Reborn / Seasons & Stars.",
    );
  }

  // Calendar APIs may already be present if their ready hooks ran first.
  initializeWeatherControl();
});

Hooks.once(HOOK_EVENTS.SimpleCalendarReady, () => {
  initializeWeatherControl();
});

Hooks.once(HOOK_EVENTS.SeasonsStarsReady, () => {
  initializeWeatherControl();
});
