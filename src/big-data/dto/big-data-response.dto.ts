import { ApiProperty } from '@nestjs/swagger';

// 定义一个类而不是接口，这样Swagger可以正确识别
export class BigDataItem {
  @ApiProperty({ example: 1, description: 'ID' })
  id: number;

  @ApiProperty({ example: 'John', description: '姓名' })
  name: string;

  @ApiProperty({ example: 20, description: '年龄' })
  age: number;
}

export class BigDataResponseDto {
  @ApiProperty({
    description: '大数组',
    example: [
      { id: 1, name: 'John', age: 20 },
      { id: 2, name: 'Jane', age: 21 },
    ],
    type: [BigDataItem],
  })
  list: BigDataItem[];
}
