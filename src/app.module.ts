import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './modules/weather/weather.module';
import { QuoteModule } from './modules/quote/quote.module';
import { ConfigModule } from '@nestjs/config';
import { BriefingModule } from './modules/briefing/briefing.module';
import { TelegramModule } from './modules/telegram/telegram.module';

@Module({
  imports: [
    WeatherModule,
    QuoteModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    BriefingModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
