import { Injectable, NotFoundException } from '@nestjs/common';
import { InitUploadDto, InitUploadResponseDto } from './dto/init-upload.dto';
import { UploadChunkResponseDto } from './dto/upload-chunk.dto';
import { CheckUploadStatusResponseDto } from './dto/check-upload-status.dto';
import { MergeChunksResponseDto } from './dto/merge-chunks.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB 分片大小
const UPLOAD_DIR = '_upload'; // 上传文件根目录

@Injectable()
export class UploadService {
  constructor() {
    // 确保上传目录存在
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR);
    }
  }

  // 存储上传信息的内存映射
  private uploadMap = new Map<string, any>();

  private getUploadDir(uploadId: string): string {
    return path.join(UPLOAD_DIR, uploadId);
  }

  async initialize(initData: InitUploadDto): Promise<InitUploadResponseDto> {
    const uploadId = uuidv4();
    // 创建上传目录
    const uploadDir = this.getUploadDir(uploadId);
    fs.mkdirSync(uploadDir);

    // 存储上传信息
    const uploadInfo = {
      fileName: initData.fileName,
      fileSize: initData.fileSize,
      fileHash: initData.fileHash,
      userId: initData.userId,
      uploadedChunks: [],
      createdAt: new Date().toISOString(),
    };

    this.uploadMap.set(uploadId, uploadInfo);

    return {
      uploadId,
      uploadedChunks: [],
      isResume: false,
      chunkSize: CHUNK_SIZE,
    };
  }

  async uploadChunk(
    uploadId: string,
    chunkIndex: number,
    chunkHash: string,
    chunk: Buffer,
  ): Promise<UploadChunkResponseDto> {
    const uploadInfo = this.uploadMap.get(uploadId);
    if (!uploadInfo) {
      throw new NotFoundException('Upload session not found');
    }

    // 验证分片是否已上传
    if (uploadInfo.uploadedChunks.includes(chunkIndex)) {
      throw new Error('Chunk already uploaded');
    }

    // 获取上传目录
    const uploadDir = this.getUploadDir(uploadId);
    const chunkPath = path.join(uploadDir, `chunk_${chunkIndex}`);

    // 写入分片文件
    await fs.promises.writeFile(chunkPath, chunk);

    // 更新上传信息
    uploadInfo.uploadedChunks.push(chunkIndex);
    this.uploadMap.set(uploadId, uploadInfo);

    // 计算总分片数
    const totalChunks = Math.ceil(uploadInfo.fileSize / CHUNK_SIZE);
    const isComplete = uploadInfo.uploadedChunks.length === totalChunks;

    // 如果所有分片都已上传，则合并文件
    if (isComplete) {
      await this.mergeChunksInternal(uploadId, uploadInfo);
    }

    return {
      success: true,
      uploadedChunks: uploadInfo.uploadedChunks.length,
      totalChunks,
      isComplete,
    };
  }

  // 检查上传状态，返回缺失的分片
  async checkUploadStatus(
    uploadId: string,
  ): Promise<CheckUploadStatusResponseDto> {
    const uploadInfo = this.uploadMap.get(uploadId);
    if (!uploadInfo) {
      throw new NotFoundException(`上传会话 ${uploadId} 不存在`);
    }

    const totalChunks = Math.ceil(uploadInfo.fileSize / CHUNK_SIZE);
    const uploadedChunks = uploadInfo.uploadedChunks || [];
    const isComplete = uploadedChunks.length === totalChunks;

    // 计算缺失的分片索引
    const missingChunks: number[] = [];
    for (let i = 0; i < totalChunks; i++) {
      if (!uploadedChunks.includes(i)) {
        missingChunks.push(i);
      }
    }

    return {
      isComplete,
      uploadedChunksCount: uploadedChunks.length,
      totalChunks,
      missingChunks,
    };
  }

  // 手动触发分片合并
  async mergeChunks(uploadId: string): Promise<MergeChunksResponseDto> {
    const uploadInfo = this.uploadMap.get(uploadId);
    if (!uploadInfo) {
      throw new NotFoundException(`上传会话 ${uploadId} 不存在`);
    }

    // 检查是否已经合并
    if (uploadInfo.status === 'completed') {
      return {
        success: true,
        fileName: uploadInfo.fileName,
        fileSize: uploadInfo.fileSize,
        filePath: uploadInfo.finalPath,
      };
    }

    const totalChunks = Math.ceil(uploadInfo.fileSize / CHUNK_SIZE);
    const uploadedChunks = uploadInfo.uploadedChunks || [];

    // 检查是否所有分片都已上传
    if (uploadedChunks.length !== totalChunks) {
      const missingCount = totalChunks - uploadedChunks.length;
      throw new Error(`无法合并文件：还有 ${missingCount} 个分片未上传`);
    }

    await this.mergeChunksInternal(uploadId, uploadInfo);

    return {
      success: true,
      fileName: uploadInfo.fileName,
      fileSize: uploadInfo.actualFileSize || uploadInfo.fileSize,
      filePath: uploadInfo.finalPath,
    };
  }

  private async mergeChunksInternal(
    uploadId: string,
    uploadInfo: any,
  ): Promise<void> {
    const uploadDir = this.getUploadDir(uploadId);
    const totalChunks = Math.ceil(uploadInfo.fileSize / CHUNK_SIZE);
    const finalFilePath = path.join(uploadDir, uploadInfo.fileName);

    // 创建写入流
    const writeStream = fs.createWriteStream(finalFilePath);

    try {
      // 按顺序合并所有分片
      for (let i = 0; i < totalChunks; i++) {
        const chunkPath = path.join(uploadDir, `chunk_${i}`);
        const chunkBuffer = await fs.promises.readFile(chunkPath);
        await new Promise<void>((resolve, reject) => {
          writeStream.write(chunkBuffer, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        // 删除已合并的分片
        await fs.promises.unlink(chunkPath);
      }
    } finally {
      writeStream.end();
    }

    // 获取最终文件大小
    const stats = await fs.promises.stat(finalFilePath);
    const actualFileSize = stats.size;

    // 更新上传信息
    uploadInfo.status = 'completed';
    uploadInfo.finalPath = finalFilePath;
    uploadInfo.actualFileSize = actualFileSize;
    this.uploadMap.set(uploadId, uploadInfo);
  }
}
