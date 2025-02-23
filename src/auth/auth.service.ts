import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'drizzle/schema';
import { eq } from 'drizzle-orm';
import { EncryptionService } from 'encryption/encryption.service';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly encryptionService: EncryptionService,
  ) {}
  async login(loginDto: LoginDto) {
    const [user] = await this.authRepository.getUser(loginDto);

    if (!user) throw new NotFoundException();

    if ((await this.encryptionService.compare(loginDto.password, user.password)) == false)
      throw new ForbiddenException(undefined, {
        description: 'Passwords does not match',
      });

    return user.id;
  }
}
