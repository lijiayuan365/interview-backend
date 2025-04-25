import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../common/dto/response.dto';
import { GenerateTextDto } from './dto/generate-text.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Post('generate')
  @ApiOperation({ summary: '生成文本' })
  @ApiResponse({ status: 200, description: '成功生成文本' })
  async generateText(
    @Body() generateTextDto: GenerateTextDto,
    @Res() res: Response,
  ): Promise<void | string> {
    const { prompt, model, stream } = generateTextDto;
    console.log('prompt', prompt);
    console.log('model', model);
    console.log('stream', stream);
    const result = await this.ollamaService.callOllama(prompt, model, stream);
    console.log('result', result);
    if (result instanceof Observable) {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Transfer-Encoding', 'chunked');
      result.subscribe({
        next: (chunk: Buffer) => {
          res.write(chunk);
        },
        complete: () => res.end(),
        error: (err) => {
          console.error('Error occurred while streaming data', err);
          res.status(500).send('Error occurred while streaming data');
        },
      });
    } else {
      res.send(ApiResponseDto.success(result));
    }
  }

  @Get('stream')
  async stream(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');

    const tokens = ['Hello', ' ', 'world', '!'];
    for (const token of tokens) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟生成延迟
      res.write(token); // 发送每个 token
    }
    res.end(); // 结束响应
  }
}
