import { Role } from 'libs/common/enum/roles.enum';

export interface AuthUser {
  id: string;
  username: string;
  role: Role;
}
