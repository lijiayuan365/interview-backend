import { Injectable } from '@nestjs/common';
import { loadOpenAuth } from '../utils/openauth-loader.util.js';

@Injectable()
export class LoginService {
  private client;
  constructor() {
    loadOpenAuth().then(({ createClient }) => {
      this.client = createClient({
        clientID: 'Ov23liKe0IeWcNxxx3sz', // 自定义客户端 ID
        issuer: 'http://127.0.0.1:3002', // OpenAuth 服务器地址
      });
    });
  }
  async getAuthorizationUrl(redirectUri: string) {
    const { url } = await this.client.authorize(redirectUri, 'code');
    return url;
  }

  async exchangeCode(code: string, redirectUri: string) {
    const tokens = await this.client.exchange(code, redirectUri);
    return tokens; // 包含 access_token 和 refresh_token
  }
}
