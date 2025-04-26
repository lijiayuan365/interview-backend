import { ApiProperty } from '@nestjs/swagger';

/**
 * 用于在Swagger中描述流式响应的DTO
 * 实际上流返回的是原始文本，这个DTO只用于文档说明
 */
export class BigDataStreamChunkDto {
  @ApiProperty({
    description: '每个数据块包含的项目列表',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          example: 1,
          description: 'ID',
        },
        name: {
          type: 'string',
          example: 'John',
          description: '姓名',
        },
        age: {
          type: 'number',
          example: 20,
          description: '年龄',
        },
      },
    },
  })
  chunk: Array<{
    id: number;
    name: string;
    age: number;
  }>;
}
