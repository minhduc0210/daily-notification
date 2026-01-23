import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import {
  ErrorResponse,
  SuccessResponse,
} from 'src/shared/interfaces/response.interface';
import { QuoteSuccessResponse } from './interfaces/quote.interface';

@Injectable()
export class QuoteService {
  constructor(private readonly configService: ConfigService) {}

  private buildRequestConfig(): AxiosRequestConfig {
    return {
      method: 'GET',
      url: this.configService.get<string>('QUOTE_API_URL'),
    } satisfies AxiosRequestConfig;
  }

  async getQuote(): Promise<
    SuccessResponse<QuoteSuccessResponse[]> | ErrorResponse
  > {
    try {
      const response = await axios.request<QuoteSuccessResponse[]>(
        this.buildRequestConfig(),
      );

      return {
        success: true,
        data: response.data,
        timestamp: new Date().toISOString(),
      } satisfies SuccessResponse<QuoteSuccessResponse[]>;
    } catch (error) {
      const statusCode = axios.isAxiosError(error)
        ? (error.response?.status ?? 500)
        : 500;
      const message = axios.isAxiosError(error)
        ? error.message
        : 'Unexpected error while fetching quote data';

      return {
        success: false,
        error: {
          statusCode,
          message,
          path: 'quote/getQuote',
        },
        timestamp: new Date().toISOString(),
      } satisfies ErrorResponse;
    }
  }
}
