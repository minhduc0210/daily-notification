import { Injectable, Logger } from '@nestjs/common';
import { WeatherService } from '../weather/weather.service';
import { QuoteService } from '../quote/quote.service';
import { SuccessResponse } from 'src/shared/interfaces/response.interface';
import { WeatherTransformedResponse } from '../weather/interfaces/weather.interface';
import { QuoteSuccessResponse } from '../quote/interfaces/quote.interface';

export interface BriefingNotification {
  success: boolean;
  messages: {
    greeting: string;
    weather?: string;
    quote?: string;
  };
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
      `☁️ Condition: ${weather.condition} (${weather.description})\n` +
      `⏰ Observed at: ${weather.observationTime}\n` +
      `🌅 Sunrise: ${weather.sunrise} | 🌇 Sunset: ${weather.sunset}`
    );
  }

  private formatQuoteSection(quote: QuoteSuccessResponse): string {
    return `💡 *Quote of the Day*\n\n` + `"${quote.q}"\n\n` + `— *${quote.a}*`;
  }

  private formatGreetingMessage(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return `👋 Good morning! Today is ${formattedDate}. Have a great day!`;
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
          messages: {
            greeting: this.formatGreetingMessage(new Date()),
          },
          timestamp: new Date().toISOString(),
        };
      }

      const messages: {
        greeting: string;
        weather?: string;
        quote?: string;
      } = {
        greeting: this.formatGreetingMessage(new Date()),
      };

      // Add weather message if successful
      if (weatherSuccess) {
        const weatherData = (
          weatherResult as SuccessResponse<WeatherTransformedResponse>
        ).data;
        if (weatherData) {
          messages.weather = this.formatWeatherSection(weatherData);
        }
      } else {
        messages.weather =
          '⚠️ *Weather Data Unavailable*\n\nCould not fetch weather information';
      }

      // Add quote message if successful
      if (quoteSuccess) {
        const quoteData = (
          quoteResult as SuccessResponse<QuoteSuccessResponse[]>
        ).data[0];
        if (quoteData) {
          messages.quote = this.formatQuoteSection(quoteData);
        }
      } else {
        messages.quote =
          '⚠️ *Quote Unavailable*\n\nCould not fetch quote of the day';
      }

      return {
        success: true,
        messages,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      Logger.error(error);
      return {
        success: false,
        messages: {
          greeting: this.formatGreetingMessage(new Date()),
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}
