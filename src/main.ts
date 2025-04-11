import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 全局注册响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  
  // 全局注册异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
   // Swagger配置
   const config = new DocumentBuilder()
   .setTitle('API Documentation')
   .setDescription('接口 json 地址  <a href="/api/docs-json">/api/docs-json</a>')
   .setVersion('1.0')
   // .addBearerAuth() // 如果需要Bearer token认证，请取消注释
   .build();
 
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api/docs', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
