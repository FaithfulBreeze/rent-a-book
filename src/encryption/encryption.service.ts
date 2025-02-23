import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class EncryptionService {
  async encrypt(str: string) {
    return await hash(str, 5);
  }

  async compare(str: string, hashedStr: string): Promise<boolean> {
    return await compare(str, hashedStr);
  }
}
