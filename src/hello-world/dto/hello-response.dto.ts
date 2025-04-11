import { ApiProperty } from '@nestjs/swagger';

export class HelloResponseDto {
  @ApiProperty({
    description: 'Hello消息',
    example: 'Hello World!',
  })
  message: string;
}
