import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class GenerateTextDto {
  @ApiProperty({
    description: '提示词',
    example: '你好，请介绍一下你自己',
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    description: '模型名称',
    example: 'deepseek-r1:1.5b',
    default: 'deepseek-r1:1.5b',
  })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({
    description: '是否使用流式响应',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  stream?: boolean;
}
