export interface WeatherSuccessResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    },
  ];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherErrorResponse {
  message: string;
}

export interface WeatherTransformedResponse {
  location: string;
  condition: string;
  description: string;
  icon: string;
  temperature: number;
  feelsLike: number;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  observationTime: string;
  sunrise: string;
  sunset: string;
}
