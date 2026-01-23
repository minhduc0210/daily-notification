import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { BriefingModule } from '../briefing/briefing.module';

@Module({
  imports: [ConfigModule, BriefingModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
