import { AuthRoleEnum } from 'src/enums/auth-role.enum';

export class CreateAuthDto {
  auth_id: string; // auth yaratayotgan inspector id si
  username: string;
  password: string;
  role: AuthRoleEnum;
}
