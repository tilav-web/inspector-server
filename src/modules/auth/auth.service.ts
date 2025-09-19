import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from './auth.schema';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthRoleEnum } from 'src/enums/auth-role.enum';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Auth.name) private model: Model<AuthDocument>) {}

  async findById(id: string) {
    return this.model.findById(id).lean();
  }

  async findByUsername(username: string) {
    return this.model.findOne({ username }).lean();
  }

  async create({ username, password, role, auth_id }: CreateAuthDto) {
    const auth = await this.findById(auth_id);

    if (role === AuthRoleEnum.REGION && auth?.role !== AuthRoleEnum.STATE)
      throw new ForbiddenException(
        `Siz ${role} turidagi inspector yaratish huquqiga ega emassiz!`,
      );

    if (
      role === AuthRoleEnum.DISTRICT &&
      auth?.role !== AuthRoleEnum.STATE &&
      auth?.role !== AuthRoleEnum.REGION
    )
      throw new ForbiddenException(
        `Siz ${role} turidagi inspector yaratish huquqiga ega emassiz!`,
      );

    if (
      role === AuthRoleEnum.NEIGHBORHOOD &&
      auth?.role !== AuthRoleEnum.STATE &&
      auth?.role !== AuthRoleEnum.REGION &&
      auth?.role !== AuthRoleEnum.DISTRICT
    )
      throw new ForbiddenException(
        `Siz ${role} turidagi inspector yaratish huquqiga ega emassiz!`,
      );

    return await this.model.create({ username, password, role });
  }
}
