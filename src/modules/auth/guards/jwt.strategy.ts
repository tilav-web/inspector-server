import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthDocument } from '../auth.schema';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  async validate(payload: { _id: string }): Promise<AuthDocument> {
    if (!payload._id)
      throw new UnauthorizedException(
        'Bu amalni bajarish uchun tizimga kirishingiz kerak!',
      );
    const auth = await this.authService.findById(payload._id);
    if (!auth)
      throw new UnauthorizedException(
        'Tizimda bu kabi foydalanuvchi topilmadi!',
      );
    return auth;
  }
}
