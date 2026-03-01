import { MODULE_METADATA, HOOK_EVENTS } from "./config/constants.js";
import { logger } from "./utils/Logger.js";
import { getGame } from "./utils/GameInstance.js";
import { SemverUtils } from "./utils/SemverUtils.js";
import { ModuleSettings } from "./settings/ModuleSettings.js";
import { MigrationManager } from "./migrations/MigrationManager.js";
import { MigrationV1 } from "./migrations/migrations/MigrationV1.js";
import { NoticeManager } from "./notices/NoticeManager.js";
import { chatProxy } from "./utils/ChatProxy.js";
import { WeatherController } from "./controller/WeatherController.js";
import { DateObjectFactory } from "./calendar/DateObjectFactory.js";

let controller = null;

function checkSimpleCalendarVersion() {
  const required = "v1.3.73";
  const game = getGame();
  const original = game.modules.get("foundryvtt-simple-calendar");
  const reborn = game.modules.get("foundryvtt-simple-calendar-reborn");

  // Prefer Simple Calendar Reborn when present; assume compatible if loaded.
  if (reborn) {
    const current = reborn.data?.version ?? reborn.version;
    if (!current) return false;
    return true;
  }

  const current = original?.data?.version ?? original?.version;
  if (!current) return false;

  return SemverUtils.isMoreRecent(current, required) || current === required;
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
  if (!checkSimpleCalendarVersion()) {
    const message =
      "Weather Control cannot initialize and requires Simple Calendar (v1.3.73+) or Simple Calendar Reborn (v2.5.3+). Make sure one of these modules is installed and enabled.";
    console.error(message);
    ui.notifications.error(message);
  }
});

Hooks.once("simple-calendar-ready", () => {
  const game = getGame();
  const settings = new ModuleSettings(game);

  if (game.user.isGM) {
    const noticeManager = new NoticeManager(game, settings);
    noticeManager.checkForNotices();
  }

  const migrationManager = new MigrationManager();
  migrationManager.register(new MigrationV1());

  const data = settings.getWeatherData();
  const migrated = migrationManager.run(data.version, data);

  const maybePromise =
    migrated &&
    (logger.info("Saving migrated data"), settings.setWeatherData(migrated));

  Promise.resolve(maybePromise).then(() => {
    controller = new WeatherController(game, chatProxy, settings);

    // Mirror original behavior: wrap Simple Calendar event into a DateObject
    Hooks.on(HOOK_EVENTS.DateTimeChange, ({ date }) => {
      const dateObject = DateObjectFactory.createDateObject(date);
      controller.onDateTimeChange(dateObject);
    });

    Hooks.on(HOOK_EVENTS.ClockStartStop, () => {
      controller.onClockStartStop();
    });

    controller.onReady();
  });
});

