import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/drizzle/schema';
import { eq, getTableColumns } from 'drizzle-orm';
import { EncryptionService } from 'src/encryption/encryption.service';
import { MailerService } from 'src/mailer/mailer.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DrizzleProvider')
    private readonly db: NodePgDatabase<typeof schema>,
    private readonly encryptionService: EncryptionService,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {}

  async create(createUserDto: CreateUserDto, validationCode?: string) {
    if (createUserDto.confirmPassword != createUserDto.password)
      throw new BadRequestException(undefined, 'Passwords does not match');
    delete createUserDto.confirmPassword;

    const result = await this.validateEmail(
      createUserDto.email,
      validationCode,
    );
    if (result) return result;

    createUserDto.password = await this.encryptionService.encrypt(
      createUserDto.password,
    );
    return this.db.insert(schema.users).values(createUserDto).returning();
  }

  findOne(id: string) {
    const { password, email, accessToken, ...columns } = getTableColumns(
      schema.users,
    );
    return this.db
      .select(columns)
      .from(schema.users)
      .where(eq(schema.users.id, id));
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.db
      .update(schema.users)
      .set(updateUserDto)
      .where(eq(schema.users.id, id));
  }

  remove(id: string) {
    return this.db.delete(schema.users).where(eq(schema.users.id, id));
  }

  async sendEmailValidationMessage(email: string) {
    const code = randomBytes(3).toString('hex');
    await this.redisService.storeValidationCode(email, code);
    this.mailerService.sendValidationCode(email, code);
  }

  async checkValidationCode(email: string) {
    return await this.redisService.getValidationCode(email);
  }

  async validateEmail(email: string, validationCode?: string) {
    if (
      (
        await this.db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, email))
      ).length > 0
    )
      throw new BadRequestException('Email already in use');

    if (!validationCode) {
      await this.sendEmailValidationMessage(email);
      return {
        message:
          'An email validation code was sent to your email, send it back as a query value on field (validation_code), the code will expire in 1 minute',
      };
    }

    if ((await this.checkValidationCode(email)) !== validationCode)
      throw new BadRequestException(undefined, 'Code not valid or expired');
  }
}
