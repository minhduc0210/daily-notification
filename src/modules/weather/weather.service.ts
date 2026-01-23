import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import {
  ErrorResponse,
  SuccessResponse,
} from 'src/shared/interfaces/response.interface';
import {
  WeatherErrorResponse,
  WeatherSuccessResponse,
  WeatherTransformedResponse,
} from './interfaces/weather.interface';
import { WeatherTransformer } from 'src/shared/utils/weather.utils';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(private readonly configService: ConfigService) {}

  private buildRequestConfig(): AxiosRequestConfig {
    return {
      method: 'GET',
      url: this.configService.get<string>('WEATHER_API_URL'),
      params: {
        city: this.configService.get<string>('CITY'),
        lang: this.configService.get<string>('LANG'),
      },
      headers: {
        'x-rapidapi-key': this.configService.get<string>('WEATHER_API_KEY'),
        'x-rapidapi-host': this.configService.get<string>('WEATHER_API_HOST'),
      },
    } satisfies AxiosRequestConfig;
  }

  private transformWeatherResponse(
    payload: WeatherSuccessResponse,
  ): WeatherTransformedResponse {
    const timezoneOffset = payload.timezone;
    const [primaryWeather] = payload.weather;

    return {
      location: `${payload.name}, ${payload.sys.country}`,
      condition: primaryWeather.main,
      description: primaryWeather.description,
      icon: primaryWeather.icon,
      temperature: WeatherTransformer.toCelsius(payload.main.temp),
      feelsLike: WeatherTransformer.toCelsius(payload.main.feels_like),
      minTemperature: WeatherTransformer.toCelsius(payload.main.temp_min),
      maxTemperature: WeatherTransformer.toCelsius(payload.main.temp_max),
      humidity: payload.main.humidity,
      pressure: payload.main.pressure,
      windSpeed: payload.wind.speed,
      observationTime: WeatherTransformer.formatUnixTime(
        payload.dt,
        timezoneOffset,
      ),
      sunrise: WeatherTransformer.formatUnixTime(
        payload.sys.sunrise,
        timezoneOffset,
      ),
      sunset: WeatherTransformer.formatUnixTime(
        payload.sys.sunset,
        timezoneOffset,
      ),
    };
  }

  async getWeather(): Promise<
    SuccessResponse<WeatherTransformedResponse> | ErrorResponse
  > {
    try {
      const response = await axios.request<WeatherSuccessResponse>(
        this.buildRequestConfig(),
      );
      const transformedData = this.transformWeatherResponse(response.data);

      return {
        success: true,
        data: transformedData,
        timestamp: new Date().toISOString(),
      } satisfies SuccessResponse<WeatherTransformedResponse>;
    } catch (error) {
      const statusCode = axios.isAxiosError(error)
        ? (error.response?.status ?? 500)
        : 500;
      const message = axios.isAxiosError(error)
        ? ((error.response?.data as WeatherErrorResponse | undefined)
            ?.message ?? error.message)
        : 'Unexpected error while fetching weather data';

      this.logger.error(`Failed to fetch weather data: ${message}`);

      return {
        success: false,
        error: {
          statusCode,
          message,
          path: 'weather/getWeather',
        },
        timestamp: new Date().toISOString(),
      } satisfies ErrorResponse;
    }
  }
}
