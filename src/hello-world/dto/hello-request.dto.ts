import { ApiProperty } from '@nestjs/swagger';

export class HelloRequestDto {
  @ApiProperty({ description: '名称', example: 'World' })
  name: string;
}
