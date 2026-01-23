import { Module } from '@nestjs/common';
import { BriefingService } from './briefing.service';
import { WeatherModule } from '../weather/weather.module';
import { QuoteModule } from '../quote/quote.module';

@Module({
  providers: [BriefingService],
  imports: [WeatherModule, QuoteModule],
  exports: [BriefingService],
})
export class BriefingModule {}
