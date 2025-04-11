import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { HelloWorldService } from './hello-world.service';
import { ApiOperation, ApiTags, } from '@nestjs/swagger';
import { HelloRequestDto, HelloResponseDto } from './dto';


@ApiTags('hello-world')
@Controller('hello-world')
export class HelloWorldController {
  constructor(private readonly helloWorldService: HelloWorldService) { }

  @Get()
  @ApiOperation({ summary: '获取问候语' })
  async getHello(@Query('name') name: string): Promise<HelloResponseDto> {
    // 直接返回数据，拦截器会自动包装为统一格式
    return await this.helloWorldService.getHello(name);
    // 如果需要抛出异常，可以使用：
    // throw new HttpException('自定义错误消息', HttpStatus.BAD_REQUEST);
  }

  @Post()
  @ApiOperation({ summary: '提交问候语' })
  async postHello(@Body() body: HelloRequestDto): Promise<HelloResponseDto> {
    return await this.helloWorldService.getHello(body.name);
  }
}

