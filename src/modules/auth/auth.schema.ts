import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AuthRoleEnum } from 'src/enums/auth-role.enum';

export type AuthDocument = Auth & Document;

@Schema({ timestamps: true })
export class Auth {
  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    required: true,
    default: AuthRoleEnum.NEIGHBORHOOD,
  })
  role: AuthRoleEnum;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
