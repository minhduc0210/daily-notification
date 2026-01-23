import { Injectable } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { QuoteService } from '../quote/quote.service';
import { SuccessResponse } from 'src/shared/interfaces/response.interface';
import { WeatherTransformedResponse } from '../weather/interfaces/weather.interface';
import { QuoteSuccessResponse } from '../quote/interfaces/quote.interface';

export interface BriefingNotification {
  success: boolean;
  notification: string;
  timestamp: string;
}

@Injectable()
export class BriefingService {
  constructor(
    private readonly weatherService: WeatherService,
    private readonly quoteService: QuoteService,
  ) {}

  private formatWeatherSection(weather: WeatherTransformedResponse): string {
    return (
      `🌍 *Weather in ${weather.location}*\n\n` +
      `🌡️ Temperature: ${weather.temperature}°C\n` +
      `🤔 Feels Like: ${weather.feelsLike}°C\n` +
      `📊 High: ${weather.maxTemperature}°C | Low: ${weather.minTemperature}°C\n` +
      `💧 Humidity: ${weather.humidity}%\n` +
      `🌬️ Wind Speed: ${weather.windSpeed} m/s\n` +
      `☁️ Condition: ${weather.condition} (${weather.description})\n` +
      `⏰ Observed at: ${weather.observationTime}\n` +
      `🌅 Sunrise: ${weather.sunrise} | 🌇 Sunset: ${weather.sunset}`
    );
  }

  private formatQuoteSection(quote: QuoteSuccessResponse): string {
    return `💡 *Quote of the Day*\n\n` + `"${quote.q}"\n\n` + `— *${quote.a}*`;
  }

  async getBriefing(): Promise<BriefingNotification> {
    try {
      const [weatherResult, quoteResult] = await Promise.all([
        this.weatherService.getWeather(),
        this.quoteService.getQuote(),
      ]);

      const weatherSuccess = weatherResult.success;
      const quoteSuccess = quoteResult.success;

      // If both failed, return error
      if (!weatherSuccess && !quoteSuccess) {
        return {
          success: false,
          notification: '❌ Failed to fetch weather and quote data',
          timestamp: new Date().toISOString(),
        };
      }

      const sections: string[] = [];

      // Add weather section if successful
      if (weatherSuccess) {
        const weatherData = (
          weatherResult as SuccessResponse<WeatherTransformedResponse>
        ).data;
        if (weatherData) {
          sections.push(this.formatWeatherSection(weatherData));
        }
      } else {
        sections.push(
          '⚠️ *Weather Data Unavailable*\n\nCould not fetch weather information',
        );
      }

      // Add quote section if successful
      if (quoteSuccess) {
        const quoteData = (
          quoteResult as SuccessResponse<QuoteSuccessResponse[]>
        ).data[0];
        if (quoteData) {
          sections.push(this.formatQuoteSection(quoteData));
        }
      } else {
        sections.push(
          '⚠️ *Quote Unavailable*\n\nCould not fetch quote of the day',
        );
      }

      const notification = sections.join(`\n\n${'─'.repeat(40)}\n\n`);

      return {
        success: true,
        notification,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        notification: `❌ Error generating briefing: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
