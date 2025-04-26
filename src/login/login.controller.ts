import { Controller, Get, Query, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { Response } from 'express';
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get()
  async login(@Res() res: Response) {
    const redirectUri = 'http://127.0.0.1:3000/login/callback';
    const authUrl = await this.loginService.getAuthorizationUrl(redirectUri);
    console.log(authUrl);
    res.redirect(authUrl);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const redirectUri = 'http://127.0.0.1:3000/login/callback';
    const tokens = await this.loginService.exchangeCode(code, redirectUri);

    // 将令牌存储在 HTTP-only cookie 中
    res.cookie('access_token', tokens.access, { httpOnly: true });
    res.cookie('refresh_token', tokens.refresh, { httpOnly: true });

    return res.redirect('/'); // 重定向到应用主页
  }
}
