import { Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { HelloWorldService } from './hello-world.service';


@Controller('hello-world')
export class HelloWorldController {
  constructor(private readonly helloWorldService: HelloWorldService) {}

  @Get()
  @Post()
  async getHello() {
    // 直接返回数据，拦截器会自动包装为统一格式
    return await this.helloWorldService.getHello();
    // 如果需要抛出异常，可以使用：
    // throw new HttpException('自定义错误消息', HttpStatus.BAD_REQUEST);
  }
}
