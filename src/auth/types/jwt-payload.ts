import { Role } from 'src/database/generated/prisma/enums';

export type JwtPayload = {
  sub: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
  firstName: string;
  lastName: string;
};
