import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { BriefingService } from '../briefing/briefing.service';

export interface TelegramSendMessageResponse {
  ok: boolean;
  result?: {
    message_id: number;
    chat: {
      id: number;
    };
    text: string;
    date: number;
  };
  description?: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly telegramApiUrl = 'https://api.telegram.org';

  constructor(
    private readonly configService: ConfigService,
    private readonly briefingService: BriefingService,
  ) {}

  private getTelegramBotToken(): string {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not configured');
    }
    return token;
  }

  private getTelegramChatId(): string {
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    if (!chatId) {
      throw new Error('TELEGRAM_CHAT_ID is not configured');
    }
    return chatId;
  }

  async sendMessage(message: string): Promise<TelegramSendMessageResponse> {
    try {
      const botToken = this.getTelegramBotToken();
      const chatId = this.getTelegramChatId();

      const url = `${this.telegramApiUrl}/bot${botToken}/sendMessage`;

      const response = await axios.post<TelegramSendMessageResponse>(url, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      });

      if (!response.data.ok) {
        this.logger.error(
          `Failed to send Telegram message: ${response.data.description}`,
        );
      } else {
        this.logger.log(
          `Message sent successfully to chat ${chatId} with message_id ${response.data.result?.message_id}`,
        );
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error sending Telegram message: ${errorMessage}`);
      throw error;
    }
  }

  async sendBriefing(): Promise<void> {
    try {
      const briefing = await this.briefingService.getBriefing();

      if (!briefing.success) {
        this.logger.warn('Briefing generation was not successful');
      }

      // Send greeting message
      if (briefing.messages.greeting) {
        await this.sendMessage(briefing.messages.greeting);
      }

      // Send weather message
      if (briefing.messages.weather) {
        await this.sendMessage(briefing.messages.weather);
      }

      // Send quote message
      if (briefing.messages.quote) {
        await this.sendMessage(briefing.messages.quote);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Error sending briefing to Telegram: ${errorMessage}`);
      throw error;
    }
  }
}
