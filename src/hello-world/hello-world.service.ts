import { Injectable } from '@nestjs/common';
import { HelloResponseDto } from './dto';
@Injectable()
export class HelloWorldService {
  async getHello(name: string): Promise<HelloResponseDto> {
    return {
      message: `Hello ${name}`
    }
  }
}
