# PlanCast

An outdoors planner that tells you what to do based on the weather. Search for a city and PlanCast fetches its current conditions, scores 12 outdoor activities against them, and recommends the best match with a percentage score. Built with vanilla HTML, CSS, and JavaScript, with no frameworks or API keys needed.

## Live Link

plan-cast.netlify.app

## Features

- **Activity recommendation**: get the best-matching outdoor activity for the city's current weather, with a match percentage
- **Weighted scoring**: each activity weighs temperature and weather conditions differently (a beach day cares more about heat, stargazing cares more about clear skies)
- **Low-match warning**: if even the best activity scores under 70%, the app tells you conditions aren't particularly favourable
- **Current weather card**: temperature (°C), condition, humidity, wind speed, and a matching emoji
- **Loading state and error handling**: clear messages for empty input, unknown cities, API failures, and lost internet connection
- **Responsive design**: a dark green UI with a single-column layout on mobile and a two-panel layout on larger screens

## Tech Stack

- HTML5
- CSS3 (custom properties, flexbox, grid, media queries)
- Vanilla JavaScript (`async/await`, Fetch API)
- [Open-Meteo](https://open-meteo.com/) Geocoding API and Forecast API (free, no API key)

## Project Structure

```
plancast/
├── index.html        # App markup
├── plan-cast.css     # Styling
├── plan-cast.js      # App logic and scoring
└── README.md
```

## Getting Started

1. Clone or download this repository:
   ```bash
   git clone <your-repo-url>
   cd plancast
   ```
2. Open `index.html` in your browser. No install or build step is needed, and you don't need an API key.

## How It Works

### 1. Fetch the weather

Searching for a city is a two-step process using Open-Meteo:

1. **Geocoding**: the city name is converted to latitude and longitude.
   ```
   https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1
   ```
2. **Current weather**: the coordinates are used to fetch temperature, weather code, humidity, and wind speed.
   ```
   https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m
   ```

The returned **WMO weather code** is mapped to a readable condition (for example "Clear sky", "Rain", "Thunderstorm") and an emoji.

### 2. Score the conditions

The current temperature and condition are each converted to a score out of 100.

**Temperature score**

| Temperature | Score |
| --- | --- |
| 24°C to 29°C | 100 |
| 21°C to 24°C or 29°C to 31°C | 90 |
| 18°C to 21°C or 31°C to 33°C | 75 |
| 15°C to 18°C or 33°C to 35°C | 55 |
| 10°C to 15°C or 35°C to 38°C | 30 |
| Below 10°C or above 38°C | 10 |

**Condition score**

| Condition | Score |
| --- | --- |
| Clear sky | 100 |
| Mainly clear | 95 |
| Partly cloudy | 85 |
| Overcast | 75 |
| Foggy | 50 |
| Drizzle, rain, or rain showers | 30 |
| Snow or thunderstorm | 10 |
| Unknown | 0 |

### 3. Match an activity

Every activity has its own weights for temperature and condition:

```
score = (temperatureWeight × temperatureScore) + (conditionWeight × conditionScore)
```

| Activity | Temperature weight | Condition weight |
| --- | --- | --- |
| Hiking | 0.65 | 0.35 |
| Beach | 0.80 | 0.20 |
| Running | 0.75 | 0.25 |
| Cycling | 0.70 | 0.30 |
| Outdoor Football | 0.55 | 0.45 |
| Picnic | 0.60 | 0.40 |
| Outdoor Photography | 0.35 | 0.65 |
| Sightseeing | 0.50 | 0.50 |
| Outdoor Dining | 0.65 | 0.35 |
| Camping | 0.55 | 0.45 |
| Park Walk | 0.60 | 0.40 |
| Stargazing | 0.30 | 0.70 |

The activity with the highest score is shown as the best match. If that score is below 70, a note says conditions aren't particularly favourable.

**Example:** at 27°C with a clear sky, both scores are 100, so every activity scores 100%. The first one in the list (Hiking) wins the tie. At 12°C with a clear sky, the temperature score is 30, so Stargazing (0.3 × 30 + 0.7 × 100 = 79%) beats Beach (0.8 × 30 + 0.2 × 100 = 44%).

## Customization

- **Add or change activities**: edit the `activities` array in `plan-cast.js`. Each entry needs a `name` and `weights` for `temperature` and `condition` that add up to 1.
- **Tune the scoring**: adjust the ranges in `temperatureScore()` and the values in `conditionScore()`.
- **Change the theme**: update the CSS variables in `:root` at the top of `plan-cast.css`.

## Error Handling

| Situation | Message |
| --- | --- |
| Empty input | "Please enter a city" |
| City not found | "City not found" |
| API returns an error | "Something went wrong. Please try again" |
| No internet connection | "Please check your internet connection and try again." |

## Known Limitations and Future Improvements

- Ties go to the first activity in the list, so ideal weather always recommends Hiking
- Time of day isn't considered, so Stargazing can be recommended at midday
- Humidity and wind speed are displayed but not used in the scoring
- Unmapped weather codes (such as snow showers) are treated as "Unknown" and score 0 for conditions
- The city shown is what the user typed, not the official name returned by the geocoding API
- The 7-day forecast is requested but not used yet
- Ideas: show the top 3 activities, factor in wind and humidity, use daylight hours, add °C/°F toggle, plan for upcoming days

## Credits

Weather data provided by [Open-Meteo](https://open-meteo.com/) (free for non-commercial use).

## License

This project is open source and available under the [MIT License](LICENSE).
