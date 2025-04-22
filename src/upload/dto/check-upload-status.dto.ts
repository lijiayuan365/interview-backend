import { ApiProperty } from '@nestjs/swagger';

export class CheckUploadStatusDto {
  @ApiProperty({
    description: '上传ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  uploadId: string;
}

export class CheckUploadStatusResponseDto {
  @ApiProperty({
    description: '是否完成',
    example: false,
  })
  isComplete: boolean;

  @ApiProperty({
    description: '已上传分片数量',
    example: 5,
  })
  uploadedChunksCount: number;

  @ApiProperty({
    description: '总分片数量',
    example: 10,
  })
  totalChunks: number;

  @ApiProperty({
    description: '未上传的分片索引数组',
    example: [5, 6, 7, 8, 9],
    type: [Number],
  })
  missingChunks: number[];
} 