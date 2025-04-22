import { ApiProperty } from '@nestjs/swagger';

export class MergeChunksDto {
  @ApiProperty({
    description: '上传ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  uploadId: string;
}

export class MergeChunksResponseDto {
  @ApiProperty({
    description: '合并是否成功',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '文件名',
    example: 'example.mp4',
  })
  fileName: string;

  @ApiProperty({
    description: '文件大小',
    example: 1024000,
  })
  fileSize: number;

  @ApiProperty({
    description: '文件路径',
    example: '_upload/550e8400-e29b-41d4-a716-446655440000/example.mp4',
  })
  filePath: string;
} 