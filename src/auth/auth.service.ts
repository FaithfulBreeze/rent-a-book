import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/drizzle/schema';
import { eq } from 'drizzle-orm';
import { EncryptionService } from 'src/encryption/encryption.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DrizzleProvider')
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly encryptionService: EncryptionService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, loginDto.email),
    });

    if (!user) throw new NotFoundException();

    if (
      (await this.encryptionService.decrypt(
        loginDto.password,
        user.password,
      )) == false
    )
      throw new ForbiddenException(undefined, {
        description: 'Passwords does not match',
      });

    return user.id;
  }
}
