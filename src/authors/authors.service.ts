import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthorsRepository } from './authors.repository';
import { UsersRepository } from 'users/users.repository';

@Injectable()
export class AuthorsService {
  constructor(
    private readonly authorsRepository: AuthorsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createAuthorDto: CreateAuthorDto, userId: string) {
    const foundUser = await this.usersRepository.findOne('id', userId);
    if (foundUser.authorProfile) throw new ConflictException('This user already have an author profile.');
    const createdAuthor = await this.authorsRepository.create(createAuthorDto);
    await this.usersRepository.update(userId, { authorProfile: createdAuthor.id });
    return createdAuthor
  }

  async findAll(limit?: number, offset?: number) {
    return await this.authorsRepository.findAll(limit, offset);
  }

  async findOne(id: string) {
    return await this.authorsRepository.findOne('id', id);
  }

  async remove(id: string) {
    const foundUser = await this.usersRepository.findOne('id', id);
    if (!foundUser.authorProfile)
      throw new BadRequestException('This user does not have an author profile to be deleted.');
    return this.authorsRepository.remove(foundUser.authorProfile);
  }
}
