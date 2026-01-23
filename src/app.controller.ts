import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { WeatherService } from './modules/weather/weather.service';
import { QuoteService } from './modules/quote/quote.service';
import { BriefingService } from './modules/briefing/briefing.service';
import { TelegramService } from './modules/telegram/telegram.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly weatherService: WeatherService,
    private readonly quoteService: QuoteService,
    private readonly briefingService: BriefingService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get()
  async getHello() {
    return await this.telegramService.sendBriefing();
  }
}
