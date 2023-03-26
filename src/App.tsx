import './index.css'
import React, { useState, useEffect } from "react";
import * as weatherIcon from "react-icons/wi";
import { IconContext } from "react-icons";

import { convertWindDirection } from "./utils";

interface WeatherCodeDescriptions {
  [code: number]: {
    codeName: string;
    icon: any;
  };
}

const weatherCodes: WeatherCodeDescriptions = {
  0: {
    codeName: "Clear sky",
    icon: <weatherIcon.WiDaySunny />
  },
  1: {
    codeName: "Mainly clear",
    icon: <weatherIcon.WiDaySunnyOvercast />
  },
  2: {
    codeName: "Partly cloudy",
    icon: <weatherIcon.WiDayCloudy />
  },
  3: {
    codeName: "Overcast",
    icon: <weatherIcon.WiCloudy />
  },
  45: {
    codeName: "Fog",
    icon: <weatherIcon.WiFog />
  },
  48: {
    codeName: "Depositing rime fog",
    icon: <weatherIcon.WiFog />
  },
  51: {
    codeName: "Drizzle (light intensity)",
    icon: <weatherIcon.WiRain />
  },
  53: {
    codeName: "Drizzle (moderate intensity)",
    icon: <weatherIcon.WiRain />
  },
  55: {
    codeName: "Drizzle (dense intensity)",
    icon: <weatherIcon.WiRain />
  },
  56: {
    codeName: "Freezing drizzle (light intensity)",
    icon: <weatherIcon.WiRain />
  },
  57: {
    codeName: "Freezing drizzle (dense intensity)",
    icon: <weatherIcon.WiRain />
  },
  61: {
    codeName: "Rain (slight intensity)",
    icon: <weatherIcon.WiRain />
  },
  63: {
    codeName: "Rain (moderate intensity)",
    icon: <weatherIcon.WiRain />
  },
  65: {
    codeName: "Rain (heavy intensity)",
    icon: <weatherIcon.WiRain />
  },
  66: {
    codeName: "Freezing rain (light intensity)",
    icon: <weatherIcon.WiRain />
  },
  67: {
    codeName: "Freezing rain (heavy intensity)",
    icon: <weatherIcon.WiRain />
  },
  71: {
    codeName: "Snow fall (slight intensity)",
    icon: <weatherIcon.WiSnow />
  },
  73: {
    codeName: "Snow fall (moderate intensity)",
    icon: <weatherIcon.WiSnow />
  },
  75: {
    codeName: "Snow fall (heavy intensity)",
    icon: <weatherIcon.WiSnow />
  },
  77: {
    codeName: "Snow grains",
    icon: <weatherIcon.WiSnow />
  },
  80: {
    codeName: "Rain showers (slight intensity)",
    icon: <weatherIcon.WiShowers />
  },
  81: {
    codeName: "Rain showers (moderate intensity)",
    icon: <weatherIcon.WiShowers />
  },
  82: {
    codeName: "Rain showers (violent intensity)",
    icon: <weatherIcon.WiShowers />
  },
  85: {
    codeName: "Snow showers (slight intensity)",
    icon: <weatherIcon.WiSnow />
  },
  86: {
    codeName: "Snow showers (heavy intensity)",
    icon: <weatherIcon.WiSnow />
  },
  95: {
    codeName: "Thunderstorm (slight or moderate)",
    icon: <weatherIcon.WiThunderstorm />
  },
  96: {
    codeName: "Thunderstorm with slight hail",
    icon: <weatherIcon.WiThunderstorm />
  },
  99: {
    codeName: "Thunderstorm with heavy hail",
    icon: <weatherIcon.WiThunderstorm />
  }
};

interface WeatherData {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_weather: {
    temperature: number;
    windspeed: number;
    winddirection: number;
    weathercode: number;
    time: string;
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
    apparent_temperature: string;
    precipitation_probability: string;
    precipitation: string;
    windspeed_10m: string;
    winddirection_10m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    windspeed_10m: number[];
    winddirection_10m: number[];
  };
  daily_units: {
    time: string;
    weathercode: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    sunrise: string;
    sunset: string;
    uv_index_max: string;
  };
  daily: {
    time: string[];
    weathercode: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
  };
}

function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  function successCallback(position: any) {
    const { latitude, longitude } = position.coords;

    const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,windspeed_10m,winddirection_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&current_weather=true&windspeed_unit=ms&forecast_days=1&timezone=auto`;

    fetch(API_URL)
      .then((response) => response.json())
      .then((data: WeatherData) => {
        setWeather(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function errorCallback(error: any) {
    console.error(error);
  }

  return (
    <IconContext.Provider value={{ size: "4em" }}>
      <div className="p-5 flex flex-col justify-center items-center h-screen">
        {weather ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl">The weather right now</h1>
            {weatherCodes[weather.current_weather.weathercode].icon}
            <div>{weather.current_weather.temperature} °C</div>
            <div>
              {weatherCodes[weather.current_weather.weathercode].codeName}
            </div>
            <div className="flex flex-row gap-x-0.5">
              <div>{weather.current_weather.windspeed} m/s</div>
              <div>
                <weatherIcon.WiDirectionUp
                  size="1.5em"
                  style={{
                    transform: `rotate(${weather.current_weather.winddirection}deg)`
                  }}
                />
              </div>
              <div>
                {convertWindDirection(weather.current_weather.winddirection)}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
        <div className="text-sm opacity-25 mt-4">
          Created by{" "}
          <a
            className="hover:underline"
            href="https://andreasbergstrom.dev"
            target="_blank"
          >
            Andreas Bergström
          </a>
          , weather data from{" "}
          <a
            className="hover:underline"
            href="https://open-meteo.com"
            target="_blank"
          >
            Open-Meteo
          </a>
          .
        </div>
      </div>
    </IconContext.Provider>
  );
}

export default Weather;
