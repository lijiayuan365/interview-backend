import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { UploadModule } from './upload/upload.module';
import { OllamaModule } from './ollama/ollama.module';
import { LoginModule } from './login/login.module';
import { BigDataController } from './big-data/big-data.controller';
import { BigDataService } from './big-data/big-data.service';
import { BigDataModule } from './big-data/big-data.module';

@Module({
  imports: [
    HelloWorldModule,
    UploadModule,
    OllamaModule,
    LoginModule,
    BigDataModule,
  ],
  controllers: [AppController, BigDataController],
  providers: [AppService, BigDataService],
})
export class AppModule {}
