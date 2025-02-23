import { Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  generateToken(id: string) {
    return sign({ id }, process.env.TOKEN_SECRET!, { expiresIn: '1d' });
  }

  verifyToken(token: string): JwtPayload | false {
    try {
      return verify(token, process.env.TOKEN_SECRET!) as JwtPayload;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
