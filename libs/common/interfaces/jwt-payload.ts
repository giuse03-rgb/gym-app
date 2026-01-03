import { Role } from 'libs/common/enum/roles.enum';

export interface JwtPayload {
  id: string;
  username: string;
  role: Role;
}
