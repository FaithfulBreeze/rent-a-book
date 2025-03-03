import { Module } from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { LibrariesController } from './libraries.controller';
import { LibrariesRepository } from './libraries.repository';
import { UsersRepository } from 'users/users.repository';

@Module({
  controllers: [LibrariesController],
  providers: [LibrariesService, LibrariesRepository, UsersRepository],
})
export class LibrariesModule {}
