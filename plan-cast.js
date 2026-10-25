const weatherInput = document.querySelector(".weather-input");
const searchWeather = document.querySelector(".search-weather");
const errorMessage = document.querySelector(".errorMessage");
const form = document.querySelector("form");
const serverMessage = document.querySelector(".serverMessage");
const loading = document.querySelector(".loading");
const searchedCity = document.querySelector(".searched-city");
const temperature = document.querySelector(".temperature");
const weatherCode = document.querySelector(".code");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");
const emoji = document.querySelector("#emoji");
const match = document.querySelector(".matched");
const percentage = document.querySelector(".percentage");
const badWeather = document.querySelector(".bad-weather");

const activities = [
    {
        name: "Hiking",
        weights: {
            temperature: 0.65,
            condition: 0.35
        }
    },
    {
        name: "Beach",
        weights: {
            temperature: 0.8,
            condition: 0.2
        }
    },
    {
        name: "Running",
        weights: {
            temperature: 0.75,
            condition: 0.25
        }
    },
    {
        name: "Cycling",
        weights: {
            temperature: 0.7,
            condition: 0.3
        }
    },
    {
        name: "Outdoor Football",
        weights: {
            temperature: 0.55,
            condition: 0.45
        }
    },
    {
        name: "Picnic",
        weights: {
            temperature: 0.6,
            condition: 0.4
        }
    },
    {
        name: "Outdoor Photography",
        weights: {
            temperature: 0.35,
            condition: 0.65
        }
    },
    {
        name: "Sightseeing",
        weights: {
            temperature: 0.5,
            condition: 0.5
        }
    },
    {
        name: "Outdoor Dining",
        weights: {
            temperature: 0.65,
            condition: 0.35
        }
    },
    {
        name: "Camping",
        weights: {
            temperature: 0.55,
            condition: 0.45
        }
    },
    {
        name: "Park Walk",
        weights: {
            temperature: 0.6,
            condition: 0.4
        }
    },
    {
        name: "Stargazing",
        weights: {
            temperature: 0.3,
            condition: 0.7
        }
    }
];

async function getCoordinates(cityName) {
    const data = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`);
    if (!data.ok) {
        throw new Error("Something went wrong. Please try again");
    }

    const response = await data.json();

    if (!response.results || response.results.length === 0) {
        throw new Error("City not found");
    }

    const latitude = response.results[0].latitude;
    const longitude = response.results[0].longitude;
    return { latitude, longitude };
}

// Get weather data
async function getWeather(latitude, longitude) {
    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&forecast_days=7`);
    if (!weather.ok) {
        throw new Error("Something went wrong. Please try again");
    }

    const weatherResponse = await weather.json();
    console.log(weatherResponse);
    return weatherResponse;
}

function getWeatherDescription(code) {

                if (code === 0) {
                    return "Clear sky";
                }

                if (code === 1) {
                    return "Mainly clear";
                }
                if (code === 2) {
                    return "Partly cloudy";
                }

               if (code === 3) {
                   return "Overcast";
                }

                if (code === 45 || code === 48) {
                    return "Foggy";
                }

                if (code >= 51 && code <= 57) {
                    return "Drizzle";
                }

                if (code >= 61 && code <= 67) {
                    return "Rain";
                }

               if (code >= 71 && code <= 77) {
                   return "Snow";
                }

                if (code >= 80 && code <= 82) {
                    return "Rain showers";
                }

                if (code >= 95) {
                    return "Thunderstorm";
                }
                return "Unknown";
            }

            function getWeatherEmoji(code) {
                if (code === 0) {
                    return "☀️";
                }

                if (code === 1) {
                    return "🌤️";
                }

                if (code === 2) {
                    return "⛅";
                }

                if (code === 3) {
                    return "☁️";
                }

                if (code === 45 || code === 48) {
                    return "🌫️";
                }

                if (code >= 51 && code <= 57) {
                    return "🌦️";
                }

                if (code >= 61 && code <= 67) {
                    return "🌧️";
                }

                if (code >= 71 && code <= 77) {
                    return "❄️";
                }

                if (code >= 80 && code <= 82) {
                    return "🌦️";
                }

                if (code >= 95) {
                    return "⛈️";
                }

                return "❓";
            }

function temperatureScore (value) {
    if (value >= 24 && value <= 29) {
        return 100;
    }
    else if (value >= 21 && value <= 24 || value >= 29 && value <= 31) {
        return 90;
    }
    else if (value >= 18 && value <= 21 || value >= 31 && value <= 33) {
        return 75;
    }
    else if (value >= 15 && value <= 18 || value >= 33 && value <= 35) {
        return 55;
    }
    else if (value >= 10 && value <= 15 || value >= 35 && value <= 38) {
        return 30;
    }
    else if (value < 10 || value > 38) {
        return 10;
    }
    return 0;
}

function conditionScore(value) {
    const normalized = value.toLowerCase();

    if (normalized === "clear sky") {
        return 100;
    }
    else if (normalized === "mainly clear") {
        return 95;
    }
    else if (normalized === "partly cloudy") {
        return 85;
    }
    else if (normalized === "overcast") {
        return 75;
    }
    else if (normalized === "foggy") {
        return 50;
    }
    else if (normalized === "rain showers" || normalized === "drizzle" || normalized === "rain") {
        return 30;
    }
    else if (normalized === "snow" || normalized === "thunderstorm") {
        return 10;
    }

    return 0;
}

function getMatchedActivity(response) {
    const conditionValue = conditionScore(getWeatherDescription(response.current.weather_code));
    const temperatureValue = temperatureScore(response.current.temperature_2m);

    const bestMatch = {name: "", score: 0}
    activities.forEach((element) => {
        const percent = (element.weights.temperature * temperatureValue) + (element.weights.condition * conditionValue);
        
        if (percent > bestMatch.score) {
            bestMatch.score = percent;
            bestMatch.name = element.name;
        }
        console.log(bestMatch.score);
    });
        if (bestMatch.score < 70) {
            match.textContent = bestMatch.name;
            percentage.textContent = `${Math.round(bestMatch.score)}% match`;
            badWeather.textContent = "Conditions aren't particularly favourable";
        }
        else {
            match.textContent = bestMatch.name;
            percentage.textContent = `${Math.round(bestMatch.score)}% match`;
        }
        
}



// Display weather data
function displayWeather(response, cityName) {
    searchedCity.textContent = `${cityName}`;
    temperature.textContent = `${response.current.temperature_2m}°C`;
    weatherCode.textContent = `${getWeatherDescription(response.current.weather_code)}`;
    emoji.textContent = `${getWeatherEmoji(response.current.weather_code)}`;
    humidity.textContent = `Humidity: ${response.current.relative_humidity_2m}%`;
    wind.textContent = `Wind: ${response.current.wind_speed_10m}km/h`;
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const cityName = weatherInput.value.trim();
    errorMessage.textContent = "";
    serverMessage.textContent = "";
    badWeather.textContent = "";

    if (cityName === "") {
        errorMessage.textContent = "Please enter a city";
        return;
    }

    try {
        loading.textContent = "Loading...";
        const coordinates = await getCoordinates(cityName);
        const weather = await getWeather(coordinates.latitude, coordinates.longitude);
        displayWeather(weather, cityName);
        getMatchedActivity(weather);
    }
    catch (error) {
        if (error.message.includes("Failed to fetch")) {
            serverMessage.textContent = "Please check your internet connection and try again.";
        }
        else {
            serverMessage.textContent = error.message;
        }
        
    } 
    finally {
        loading.textContent = "";
    }
});