import { Injectable } from '@nestjs/common';

@Injectable()
export class HelloWorldService {
  async getHello(): Promise<string> {
    return 'Hello World';
  }
}
