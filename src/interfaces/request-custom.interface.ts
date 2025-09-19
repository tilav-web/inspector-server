import { Request } from 'express';
import { AuthRoleEnum } from 'src/enums/auth-role.enum';

export interface IRequestCustom extends Request {
  user?: {
    _id: string;
    role: AuthRoleEnum;
    usernmae: string;
    password: string;
  };
}
