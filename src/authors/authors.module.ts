import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';
import { UsersRepository } from 'users/users.repository';
import { AuthorsRepository } from './authors.repository';

@Module({
  controllers: [AuthorsController],
  providers: [AuthorsService, UsersRepository, AuthorsRepository],
})
export class AuthorsModule {}
