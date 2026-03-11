import 'express';
import { JwtPayload } from 'src/auth/types/jwt-payload';

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}
