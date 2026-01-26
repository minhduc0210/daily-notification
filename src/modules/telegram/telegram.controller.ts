import { Controller, Get } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}
  @Get('daily')
  async getDailyNotification() {
    return await this.telegramService.sendBriefing();
  }
}
