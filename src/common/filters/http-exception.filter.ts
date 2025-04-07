import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 
      exception instanceof HttpException
        ? exception.message
        : '服务器内部错误';
    
    this.logger.error(
      `${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : '未知错误',
    );

    response.status(status).json({
      code: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      data: null,
    });
  }
} 