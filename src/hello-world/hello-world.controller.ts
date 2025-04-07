import { Controller, Get, Post } from '@nestjs/common';
import { HelloWorldService } from './hello-world.service';

@Controller('hello-world')
export class HelloWorldController {
  constructor(private readonly helloWorldService: HelloWorldService) {}

  @Get()
  @Post()
  async getHello(): Promise<{ msg: string }> {
    const msg = await this.helloWorldService.getHello();
    return { msg };
  }
}
