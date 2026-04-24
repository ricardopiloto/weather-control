import { MODULE, i18nTodaysWeather } from "./const.js";
import { removeTemperature, getKeyByVal } from "./util.js"
import { toggleApp, weatherSource, autoApply, linkWeatherToGI } from "./settings.js"
import { lang, fvttVersion, weatherEffects } from "./weatherfx.js";
import { createEffect } from "./effect.js"

export async function weatherControlHooks() {
    if (game.modules.get('weather-control').active) {
        Hooks.on('renderT', async function (app, html, data) {
            if (weatherSource === 'weather-control') {
                if (!isChatOutputOn()) {
                    noChatOutputDialog();
                }
                if (!game.settings.get("weatherfx", "currentWeather"))
                    await getPrecipitation();
            }
        })

        // Hook on every created message, if this is a message created with the alias "Today's Weather", then trigger the Weather FX part.
        // Ignore the optional Weather Control *detail* message (distinct speaker alias).
        Hooks.on('createChatMessage', async function (message) {
            if (weatherSource === 'weather-control') {
                const json = await langJson();
                const todaysWeather = json[i18nTodaysWeather];
                const detailSpeaker = json["wctrl.dslf.chatDetailSpeaker"];
                let sceneAutoApply = game.scenes.viewed.getFlag('weatherfx', 'auto-apply') ? true : false;
                if (fvttVersion < 10) //compatibility with v9
                    message = message.data;
                if (detailSpeaker && message.speaker.alias === detailSpeaker) {
                    return;
                }
                if (message.speaker.alias == todaysWeather) {
                    let precipitation = await precipitationLineForFx(message.content);
                    await game.settings.set(MODULE, "currentWeather", precipitation);
                    const shouldApplyForScene = !linkWeatherToGI || !!canvas.scene?.globalLight;
                    if (shouldApplyForScene && autoApply && sceneAutoApply) {
                        checkWeather(precipitation);
                    }
                }
            }
        });
    }
}

// Temporary fix: when Weather FX has no chat string, read weather-control settings. Prefer DSLF one-line summary when `dslf` is present (panel HTML is not a weather line).
export async function getPrecipitation() {
    const full = game.settings.get("weather-control", "weatherData");
    let weatherData = full?.precipitation;
    if (full?.dslf?.columns) {
        weatherData = await dslfChatSummaryLineFromWeatherData(full);
    }
    await game.settings.set("weatherfx", "currentWeather", weatherData);
    return weatherData;
}

export function toggleWeatherControl() {
    const defaultPosition = { top: 100 * toggleApp, left: 100 * toggleApp };
    game.settings.set("weatherfx", "toggleApp", toggleApp * -1)
    const element = document.getElementById('weather-control-container');
    if (element) {
        element.style.top = defaultPosition.top + 'px';
        element.style.left = defaultPosition.left + 'px';
        element.style.bottom = null;
    }
}

export function isChatOutputOn() {
    let outputWeatherChat = game.settings.get('weather-control', 'outputWeatherChat')
    // let precipitation = app.weatherTracker.weatherData.precipitation
    if (!outputWeatherChat) {
        const errorMessage = "Weather FX cannot initialize and requires Weather Control 'Output weather to chat?' setting checked in order to get the current weather and apply effects to the current canvas.";
        console.error(errorMessage);
        ui.notifications.error(errorMessage);
    }
    return outputWeatherChat
}

export function noChatOutputDialog() {
    new Dialog({
        title: "No weather data!",
        content: "<p>Please activate <b>Weather Control</b> output to chat, otherwise Weather FX can't access its data</p>",
        buttons: {
            yes: {
                icon: "<i class='fas fa-check'></i>",
                label: "Activate",
                callback: async () => {
                    await game.settings.set('weather-control', 'outputWeatherChat', true)
                    await getPrecipitation();
                }
            },
            no: {
                icon: "<i class='fas fa-times'></i>",
                label: "No, I won't",
                callback: async () => {
                    return
                }
            },
        },
        default: "yes",
    }).render(true);
}

export async function langJson(language = lang) {
    let file = await fetch(`modules/weather-control/lang/${language}.json`);
    let json = await file.json();
    return json;
}

/**
 * Prefer Weather Control `weatherData.dslf` when present (ground truth for DSLF mode),
 * otherwise parse the chat line (legacy / fallback).
 * @param {string} messageContent
 * @returns {Promise<string|false>}
 */
export async function precipitationLineForFx(messageContent) {
    const wd = game.settings.get("weather-control", "weatherData");
    if (wd?.dslf?.columns) {
        return dslfChatSummaryLineFromWeatherData(wd);
    }
    return removeTemperature(messageContent);
}

/**
 * Mirrors weather-control `dslfChatSummaryLine` + `_dslfWeatherFxPrecipSegment` using English keys for `checkWeather`.
 * @param {object} weatherData
 * @returns {Promise<string>}
 */
export async function dslfChatSummaryLineFromWeatherData(weatherData) {
    const columns = weatherData.dslf.columns;
    const json = await langJson();
    const loc = (k) => json[k] ?? k;
    const precipLine = dslfWeatherFxPrecipSegment(columns, loc, weatherData);
    const parts = [
        precipLine,
        loc(`wctrl.dslf.vis.${columns.visibility}`),
        loc(`wctrl.dslf.wind.${columns.wind}`),
    ];
    return parts.filter(Boolean).join("; ");
}

/**
 * @param {object} columns
 * @param {(k: string) => string} loc
 * @param {{ temp?: number } | null} [weatherData]
 */
function dslfWeatherFxPrecipSegment(columns, loc, weatherData) {
    const t = columns.temperature;
    const p = columns.precipitation;
    const w = columns.wind;
    const cold = t === "chilly" || t === "bitter";
    if (!cold) {
        return loc(`wctrl.dslf.precip.${p}`);
    }
    const tempF = weatherData?.temp;
    const subFreezing =
        typeof tempF === "number" && Number.isFinite(tempF) && tempF < 32;
    if (!subFreezing) {
        if (p === "very_heavy" && w === "very_strong") {
            return loc("wctrl.weather.tracker.normal.TorrentialRain");
        }
        if (p === "heavy" && (w === "strong" || w === "very_strong")) {
            return loc("wctrl.weather.tracker.normal.HeavyRain");
        }
        if (p === "heavy" && (w === "still" || w === "light" || w === "medium")) {
            return loc("wctrl.weather.tracker.normal.ModerateRainW");
        }
        if (p === "light") {
            return loc("wctrl.weather.tracker.normal.ModerateRainW");
        }
        return loc(`wctrl.dslf.precip.${p}`);
    }
    if (p === "very_heavy" && w === "very_strong") {
        return loc("wctrl.weather.tracker.normal.Blizzard");
    }
    if (p === "heavy" && (w === "strong" || w === "very_strong")) {
        return loc("wctrl.weather.tracker.normal.HeavySnow");
    }
    if (p === "heavy" && (w === "still" || w === "light" || w === "medium")) {
        return loc("wctrl.weather.tracker.normal.LargeSnow");
    }
    if (p === "light") {
        return loc("wctrl.weather.tracker.normal.LightSnow");
    }
    return loc(`wctrl.dslf.precip.${p}`);
}

// checks the string for which weather was generated, create the effect and passes it as argument for Weather Effects function.
export async function checkWeather(msgString) {
    const raw = msgString != null && typeof msgString === "string" ? msgString : String(msgString ?? "");

    if (weatherSource === 'weather-control') {
        let weatherObject = await langJson();
        let comparableString = await getKeyByVal(weatherObject, raw);
        let enJson = await langJson("en");
        const enValue = comparableString != null ? enJson[comparableString] : undefined;
        msgString = (typeof enValue === "string" ? enValue : raw).toLowerCase();
    } else {
        msgString = raw.toLowerCase();
    }

    if (msgString.includes('rain')) {
        if (msgString.includes('heavy') || msgString.includes('monsoon')) {
            return weatherEffects(createEffect('heavyRain'));
        }
        else if (msgString.includes('firey')) {
            return console.log('🐺******** Preciso fazer ainda: FIERY');
        }
        else if (msgString.includes('freezing')) {
            return weatherEffects(createEffect('moderateFreezingRain'));
        }
        else if (msgString.includes('torrential')) {
            return weatherEffects(createEffect('thunderstorm'));
        }
        else
            return weatherEffects(createEffect('moderateRain'));
    }

    else if (msgString.includes('overcast')) {
        switch (true) {
            case msgString.includes('freezing'): return weatherEffects(createEffect('overcastFreezing'));
            case msgString.includes('drizzles'): return weatherEffects(createEffect('overcastDrizzle'));
            case msgString.includes('snow'): return weatherEffects(createEffect('overcastSnow'));
        }
    }
    else if (msgString.includes('snow')) {
        switch (true) {
            case msgString.includes('heavy'): return weatherEffects(createEffect('heavySnow'));
            case msgString.includes('large'): return weatherEffects(createEffect('moderateSnow'));
            case msgString.includes('light'): return weatherEffects(createEffect('lightSnow'));
        }
    }
    else if (msgString.includes('flooding'))
        return weatherEffects(createEffect('thunderstorm'));

    else if (msgString.includes('blizzard'))
        return weatherEffects(createEffect('blizzard'));

    else if (msgString.includes('icestorm') || (msgString.includes('ice') && msgString.includes('storm')))
        return weatherEffects(createEffect('iceStorm'));

    else if (msgString.includes('clear sky'))
        return weatherEffects(createEffect('clear'));

    else if (msgString.includes('dark'))
        return weatherEffects(createEffect('darkSky'));

    else if (msgString.includes('scattered clouds'))
        return weatherEffects(createEffect('partlyCloudy'));

    else if (msgString.includes('sun') || msgString.includes('volcano'))
        return weatherEffects(createEffect('sunAsh'));

    else if (msgString.includes('ashfall') || msgString.includes('ashen'))
        return weatherEffects(createEffect('ashfall'));

    else if (msgString.includes('drought'))
        return weatherEffects(createEffect('drought'));

    else if (msgString.includes('hail'))
        return weatherEffects(createEffect('hailStorm'));
}

