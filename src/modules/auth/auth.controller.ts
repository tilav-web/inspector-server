import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('/')
  async login(@Body() dto: { username: string; password: string }) {
    const result = await this.service.login(dto);
    return result;
  }
}
