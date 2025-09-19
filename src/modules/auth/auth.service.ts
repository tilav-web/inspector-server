import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InspectorService } from '../inspector/inspector.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private model: Model<AuthDocument>,
    private readonly inspectorService: InspectorService,
    private readonly jwtService: JwtService,
  ) {}

  async findById(id: string) {
    return this.model.findById(id).lean();
  }

  async login({ username, password }: { username: string; password: string }) {
    if (!username)
      throw new BadRequestException('Foydalanuvchi nomi kiritilmagan!');
    if (!password) throw new BadRequestException('Parol kiritilmagan!');

    const auth = await this.model.findOne({ username }).lean();
    if (!auth)
      throw new BadRequestException(
        'Bu kabi inspektor tizimda mavjut emas. Username tekshiring!',
      );

    const isMatch = await bcrypt.compare(password, auth.password);

    if (!isMatch) throw new BadRequestException('Parolda xatolik bor!');

    const inspector = await this.inspectorService.findByAuthId(
      auth._id as string,
    );
    const access_token = await this.jwtService.signAsync({
      _id: auth._id,
      username: auth.username,
      role: auth.role,
    });

    return { inspector, access_token };
  }
}
