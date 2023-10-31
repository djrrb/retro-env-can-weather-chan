import { FORECAST_FOUR_LINE_WITH_PREFIX_MAX_LENGTH } from "consts/forecast.consts";

// we use this function to make sure the forecast isn't trailing off the screen (32 chars per line, 8 lines per screen, forecast generally has either 4 lines or ~2 lines)
export function abbreviateForecast(
  forecastSummary: string,
  maxCharacters: number = FORECAST_FOUR_LINE_WITH_PREFIX_MAX_LENGTH
) {
  let shortForecast = forecastSummary.toLowerCase();

  // abbreviate measurement units
  shortForecast = abbreviateUnits(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // abbreviate temps
  shortForecast = abbreviateTemps(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // garbage words
  shortForecast = removeGarbageWords(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // joining words
  shortForecast = removeJoiningWords(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // long compass
  shortForecast = abbreviateLongCompassDirections(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // wind speeds
  shortForecast = abbreviateWindSpeed(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // precip amounts
  shortForecast = abbreviatePrecipitationPredictions(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // chance of precip
  shortForecast = abbreviateChanceOfPrecipitation(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // short compass
  shortForecast = abbreviateShortCompassDirections(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // conditons
  shortForecast = abbreviateConditions(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // wintery conditions
  shortForecast = abbreviateWinterConditions(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // abbreviate time of day
  shortForecast = abbreviateTimeOfDay(shortForecast);
  if (shortForecast.length <= maxCharacters) return shortForecast;

  // nothing more we can do, last attempt
  shortForecast = finalAbbreviationAttempt(shortForecast);
  return shortForecast;
}

const abbreviateUnits = (forecast: string) =>
  forecast.replace(/\spercent chance/gi, "% chance").replace(/\skm\/h/gi, "");

// turn ZERO into just the number 0
// find PLUS 1-5 and change that into +number
// find PLUS number and change that into just number
// find MINUS number and change that into just -number
// temperature steady changed to temp steady
const abbreviateTemps = (forecast: string) =>
  forecast
    .replace(/zero/gi, "0")
    .replace(/plus ([1-5])/gi, "+$1")
    .replace(/plus (\d+)/gi, "$1")
    .replace(/minus (\d+)/gi, "-$1")
    .replace(/temperature/gi, "temp");

const abbreviateTimeOfDay = (forecast: string) =>
  forecast
    .replace(/morning/gi, "mrng")
    .replace(/afternoon/gi, "aftn")
    .replace(/evening/gi, "eve")
    .replace(/midnight/gi, "12am")
    .replace(/beginning/gi, "bgng")
    .replace(/occasional/gi, "ocnl")
    .replace(/early this eve/gi, "early eve");

const removeGarbageWords = (forecast: string) =>
  forecast.replace(/\sin outlying areas/gi, "").replace(/developing\s/gi, "");

const removeJoiningWords = (forecast: string) =>
  forecast
    .replace(/becoming/gi, "bcmg")
    .replace(/increasing/gi, "incr")
    .replace(/diminishing/gi, "dmnshg")
    .replace(/\sa few/gi, "")
    .replace(/with/gi, "w/")
    .replace(/([a-z])\sor\s/gi, "$1/");

const abbreviateLongCompassDirections = (forecast: string) =>
  forecast
    .replace(/northeast/gi, "NE")
    .replace(/southeast/gi, "SE")
    .replace(/southwest/gi, "SW")
    .replace(/northwest/gi, "NW");

const abbreviateWindSpeed = (forecast: string) => forecast.replace(/\sgusting to\s/gi, "g");

const abbreviatePrecipitationPredictions = (forecast: string) =>
  forecast.replace(/amount (\d+) (-|to) (\d+) (cm|mm)/gi, "amount $1-$3$4");

const abbreviateChanceOfPrecipitation = (forecast: string) => {
  const initialAbbreviation = forecast.replace(/chance/gi, "chnc");
  if (forecast.includes("near"))
    return initialAbbreviation.replace(
      /(\d+)% chnc (.+?) changing to (\d+)% chnc .+(noon|midnigh)/gi,
      "$1-$3% chnc $2 until $4"
    );

  return initialAbbreviation.replace(/(\d+)% chnc (.+?) changing to (\d+)% chnc (.+)/gi, "$1-$3% chnc $4");
};

const abbreviateShortCompassDirections = (forecast: string) =>
  forecast.replace(/north/gi, "N").replace(/east/gi, "E").replace(/south/gi, "S").replace(/west/gi, "W");

const abbreviateConditions = (forecast: string) =>
  forecast
    .replace(/showers/gi, "shwrs")
    .replace(/thunderstorm/gi, "tstorm")
    .replace(/partly cloudy/gi, "ptly cldy")
    .replace(/(a\s)?mix of sun and cloud/gi, "mix sun/cld");

const abbreviateWinterConditions = (forecast: string) =>
  forecast.replace(/blowing snow/gi, "blwg snow").replace(/flurries/gi, "flrys");

const finalAbbreviationAttempt = (forecast: string) => forecast.replace(/kmh\s/gi, "");
