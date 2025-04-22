import { ApiProperty } from '@nestjs/swagger';

/**
 * 初始化上传请求
 */
export class InitUploadDto {
  @ApiProperty({
    description: '文件名',
    example: 'example.mp4',
  })
  fileName: string;

  @ApiProperty({
    description: '文件大小（字节）',
    example: 1024000,
  })
  fileSize: number;

  @ApiProperty({
    description: '文件哈希值（用于验证文件完整性）',
    example: 'e7c22b994c59d9cf2b48e549b1e24666',
  })
  fileHash: string;

  @ApiProperty({
    description: '用户ID（可选）',
    required: false,
    example: 'user123',
  })
  userId?: string;
}

/**
 * 初始化上传响应
 */
export class InitUploadResponseDto {
  @ApiProperty({
    description: '上传ID',
    example: 'upload_123456789',
  })
  uploadId: string;

  @ApiProperty({
    description: '已上传的分片索引列表',
    example: [0, 1, 2],
    type: [Number],
  })
  uploadedChunks: number[];

  @ApiProperty({
    description: '是否为续传',
    example: true,
  })
  isResume: boolean;

  @ApiProperty({
    description: '分片大小',
    example: 1024000,
  })
  chunkSize: number;
}
