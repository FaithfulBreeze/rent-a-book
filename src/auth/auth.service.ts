import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
    const foundUser = await this.authRepository.findOne(loginDto.email);

    if (!foundUser) throw new NotFoundException();

    if ((await this.encryptionService.compare(loginDto.password, foundUser.password)) == false)
      throw new ForbiddenException(undefined, {
        description: 'Passwords does not match',
      });

    return { message: 'You are now logged in!', id: foundUser.id };
  }
}
