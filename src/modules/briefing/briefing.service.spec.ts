import { Test, TestingModule } from '@nestjs/testing';
import { BriefingService } from './briefing.service';
import { WeatherService } from '../weather/weather.service';
import { QuoteService } from '../quote/quote.service';

describe('BriefingService', () => {
  let service: BriefingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BriefingService, WeatherService, QuoteService],
    }).compile();

    service = module.get<BriefingService>(BriefingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
