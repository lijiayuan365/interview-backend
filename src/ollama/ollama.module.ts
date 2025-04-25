import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OllamaService } from './ollama.service';
import { OllamaController } from './ollama.controller';

@Module({
  imports: [HttpModule],
  providers: [OllamaService],
  controllers: [OllamaController],
})
export class OllamaModule {}
