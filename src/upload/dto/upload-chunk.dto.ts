import { ApiProperty } from '@nestjs/swagger';

export class UploadChunkHeadersDto {
  @ApiProperty({
    description: '上传ID',
    example: 'upload_123456789',
  })
  'x-upload-id': string;

  @ApiProperty({
    description: '分片索引',
    example: 0,
  })
  'x-chunk-index': number;

  @ApiProperty({
    description: '分片哈希值',
    example: 'abc123def456',
  })
  'x-chunk-hash': string;
}

export class UploadChunkResponseDto {
  @ApiProperty({
    description: '分片是否上传成功',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '已上传的分片数量',
    example: 5,
  })
  uploadedChunks: number;

  @ApiProperty({
    description: '总分片数量',
    example: 10,
  })
  totalChunks: number;

  @ApiProperty({
    description: '是否所有分片都已上传完成',
    example: false,
  })
  isComplete: boolean;
}
