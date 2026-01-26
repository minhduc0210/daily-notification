import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { BriefingModule } from '../briefing/briefing.module';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [ConfigModule, BriefingModule],
  providers: [TelegramService],
  exports: [TelegramService],
  controllers: [TelegramController],
})
export class TelegramModule {}
