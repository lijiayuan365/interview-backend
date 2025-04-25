import {
  Controller,
  Post,
  Body,
  Headers,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
} from '@nestjs/common';
import { InitUploadDto, InitUploadResponseDto } from './dto/init-upload.dto';
import { UploadService } from './upload.service';
import { ApiOperation, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {
  CheckUploadStatusResponseDto,
  MergeChunksResponseDto,
  UploadChunkHeadersDto,
  UploadChunkResponseDto,
  MergeChunksDto,
} from './dto/index.dto';
import { ApiResponseDecorator } from '../common/dto/response.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: '初始化文件上传' })
  @ApiResponseDecorator(InitUploadResponseDto)
  @Post('init')
  async init(@Body() body: InitUploadDto): Promise<InitUploadResponseDto> {
    return this.uploadService.initialize(body);
  }

  @ApiOperation({ summary: '上传文件分片' })
  @ApiResponseDecorator(UploadChunkResponseDto)
  @ApiConsumes('multipart/form-data')
  @Post('chunk')
  @UseInterceptors(FileInterceptor('file'))
  async uploadChunk(
    @Headers() headers: UploadChunkHeadersDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadChunkResponseDto> {
    return this.uploadService.uploadChunk(
      headers['x-upload-id'],
      Number(headers['x-chunk-index']),
      headers['x-chunk-hash'],
      file.buffer,
    );
  }

  @ApiOperation({ summary: '检查上传状态' })
  @ApiResponseDecorator(CheckUploadStatusResponseDto)
  @ApiParam({ name: 'uploadId', description: '上传ID' })
  @Get('status/:uploadId')
  async checkStatus(
    @Param('uploadId') uploadId: string,
  ): Promise<CheckUploadStatusResponseDto> {
    return this.uploadService.checkUploadStatus(uploadId);
  }

  @ApiOperation({ summary: '合并文件分片' })
  @ApiResponseDecorator(MergeChunksResponseDto)
  @Post('merge')
  async merge(@Body() body: MergeChunksDto): Promise<MergeChunksResponseDto> {
    return this.uploadService.mergeChunks(body.uploadId);
  }
}
