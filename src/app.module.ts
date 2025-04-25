import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { UploadModule } from './upload/upload.module';
import { OllamaModule } from './ollama/ollama.module';

@Module({
  imports: [HelloWorldModule, UploadModule, OllamaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
