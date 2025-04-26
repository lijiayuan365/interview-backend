import { Controller, Post, Res } from '@nestjs/common';
import { BigDataService } from './big-data.service';
import { ApiResponseDecorator } from '../common/dto/response.dto';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { BigDataResponseDto } from './dto/big-data-response.dto';
import { BigDataStreamChunkDto } from './dto/big-data-stream-response.dto';
import { Response } from 'express';

@ApiTags('big-data')
@ApiExtraModels(BigDataStreamChunkDto)
@Controller('big-data')
export class BigDataController {
  constructor(private readonly bigDataService: BigDataService) {}

  @Post('big-data')
  @ApiOperation({ summary: '获取大数组' })
  @ApiResponseDecorator(BigDataResponseDto)
  getBigData() {
    return this.bigDataService.getBigData();
  }

  @Post('big-data-stream')
  @ApiOperation({
    summary: '获取大数组（流式返回）',
    description:
      '以流的形式返回大数组数据，每次返回100条记录，客户端需要按行解析返回的JSON数据',
  })
  @ApiResponse({
    status: 200,
    description:
      '流式返回大数组数据，每个块包含100个元素，以换行符分隔的JSON格式返回',
    content: {
      'text/plain': {
        schema: {
          type: 'string',
          format: 'binary',
          description: '每行包含一个JSON数组，代表数据块',
          example:
            '[{"id":1,"name":"John","age":20},{"id":2,"name":"Jane","age":21},...]\n[{"id":101,"name":"Mike","age":30},...]\n',
        },
      },
    },
  })
  async getBigDataStream(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    const { list } = await this.bigDataService.getBigData();
    const chunkSize = 20;
    // 分批处理数据
    const processData = async () => {
      for (let i = 0; i < list.length; i += chunkSize) {
        const chunk = list.slice(i, i + chunkSize);
        res.write(JSON.stringify([...chunk]) + '\n');
        // 添加延时避免过快发送
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      res.end();
    };
    // 启动数据处理
    processData();
  }
}
