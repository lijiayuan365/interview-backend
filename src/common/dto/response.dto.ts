import { ApiProperty } from '@nestjs/swagger';
import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty({ example: 0 })
  code: number;

  @ApiProperty({ example: 'success' })
  message: string;

  data: T;
  constructor(code: number, data: T, message: string) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success<T>(data: T, message = '成功'): ApiResponseDto<T> {
    return new ApiResponseDto<T>(0, data, message);
  }

  static error(message = '失败', code = -1): ApiResponseDto<null> {
    return new ApiResponseDto<null>(code, null, message);
  }
}

// 用于简化 Swagger 响应装饰器的使用
export const ApiResponseDecorator = <T extends Type<any>>(model: T) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
    }),
  );
};
