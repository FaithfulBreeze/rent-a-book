import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { MailerService } from 'mailer/mailer.service';
import { randomBytes } from 'crypto';
import { RedisService } from 'redis/redis.service';
import { EncryptionService } from 'encryption/encryption.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async create(createUserDto: CreateUserDto, validationCode?: string) {
    if (createUserDto.password != createUserDto.confirmPassword)
      throw new BadRequestException('Fields password and confirmPassword does not match.');

    const [foundEmailInUse] = await this.usersRepository.getUserData('email', createUserDto.email);
    if (foundEmailInUse) throw new ConflictException(`The email '${foundEmailInUse.email}' is already in use.`);

    const [foundUsernameInUse] = await this.usersRepository.getUserData('username', createUserDto.username);
    if (foundUsernameInUse)
      throw new ConflictException(`The username '${foundUsernameInUse.username}' is already in use.`);

    if (!validationCode) {
      const code = randomBytes(3).toString('hex');
      await this.redisService.storeValidationCode(createUserDto.email, code);
      await this.mailerService.sendValidationCode(createUserDto.email, code);
      return {
        message: `A validation code was sent to your email, send it back in a new request in the query param 'validation_code'.`,
      };
    }

    const code = await this.redisService.getValidationCode(createUserDto.email);
    if (!code) throw new BadRequestException('The validation code expired.');
    if (code != validationCode) throw new BadRequestException('Invalid validation code.');

    createUserDto.password = await this.encryptionService.encrypt(createUserDto.password);

    const { confirmPassword, ...Dto } = createUserDto;
    const [{ password, ...createdUser }] = await this.usersRepository.createUser(Dto);
    return createdUser;
  }

  findOne(id: string) {
    return this.usersRepository.getUserData('id', id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if(!Object.keys(updateUserDto).length) throw new BadRequestException('No data provided.')
    if (updateUserDto.username) {
      const [foundUsernameInUse] = await this.usersRepository.getUserData('username', updateUserDto?.username);
      if (foundUsernameInUse)
        throw new ConflictException(`The username '${foundUsernameInUse.username}' is already in use.`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.encryptionService.encrypt(updateUserDto.password);
    }

    const [{ password, accessToken, ...updatedUser }] = await this.usersRepository.updateUser(id, updateUserDto);
    return updatedUser;
  }

  async remove(id: string) {
    const [user] = await this.usersRepository.getUserData('id', id);
    if (!user) throw new NotFoundException();
    await this.usersRepository.removeUser(id);
    return { message: 'User removed.' };
  }
}
