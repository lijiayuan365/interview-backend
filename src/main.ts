import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局注册响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // 全局注册异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
