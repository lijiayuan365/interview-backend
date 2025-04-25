import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, Observable } from 'rxjs';
import awaitTo from 'await-to-js';

interface OllamaResponse {
  response: string;
}

const LLM_URL = 'http://127.0.0.1:11434';

@Injectable()
export class OllamaService {
  constructor(private readonly httpService: HttpService) {}
  async callOllama(
    prompt: string,
    model: string = 'deepseek-r1:1.5b',
    stream: boolean = true,
  ): Promise<string | Observable<any>> {
    if (stream) {
      return new Observable((observer) => {
        this.httpService
          .post(
            `${LLM_URL}/api/generate`,
            { prompt, model, stream },
            { responseType: 'stream' },
          )
          .subscribe({
            next: (response) => {
              // 处理流式数据
              response.data.on('data', (chunk) => {
                const data = JSON.parse(chunk);
                if (data.error) {
                  observer.error(data.error);
                } else {
                  observer.next(data.response);
                }
              });

              // 流结束时完成 Observable
              response.data.on('end', () => {
                observer.complete();
              });

              // 处理流中的错误
              response.data.on('error', (error) => {
                observer.error(error);
              });
            },
            error: (error) => {
              // 处理 HTTP 请求本身的错误
              observer.error(error);
            },
          });
      });
    } else {
      const [err, response] = await awaitTo<any>(
        firstValueFrom(
          this.httpService.post<OllamaResponse>(`${LLM_URL}/api/generate`, {
            prompt,
            model,
            stream,
          }),
        ),
      );
      if (err) {
        console.log('err ==========', err);
        throw err;
      }
      return response.data.response;
    }
  }
}
