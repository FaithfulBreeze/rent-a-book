import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { LibrariesRepository } from './libraries.repository';
import { UsersRepository } from 'users/users.repository';
import { UpdateUserDto } from 'users/dto/update-user.dto';

@Injectable()
export class LibrariesService {
  constructor(
    private readonly librariesRepository: LibrariesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async create(createLibraryDto: CreateLibraryDto, userId: string) {
    const [foundUser] = await this.usersRepository.getUserData('id', userId);
    if (foundUser.libraryId) throw new ConflictException('This user already has a library.');
    const foundLibrary = await this.librariesRepository.findOne('name', createLibraryDto.name);
    if (foundLibrary) throw new ConflictException(`The library name ${createLibraryDto.name} is already in use.`);
    const createdLibrary = await this.librariesRepository.create(createLibraryDto);
    await this.usersRepository.updateUser(userId, { libraryId: createdLibrary.id } as UpdateUserDto);
    return createdLibrary;
  }

  async findAll(limit?: number, offset?: number) {
    return await this.librariesRepository.findAll(limit, offset);
  }

  async findOne(id: string) {
    return await this.librariesRepository.findOne('id', id);
  }

  async update(id: string, updateLibraryDto: UpdateLibraryDto) {
    if (!Object.keys(updateLibraryDto).length) throw new BadRequestException('No data provided.');
    if (updateLibraryDto.name) {
      const foundNameInUse = await this.librariesRepository.findOne('name', updateLibraryDto.name);
      if (foundNameInUse) throw new ConflictException(`The library name '${foundNameInUse.name}' is already in use.`);
    }

    return await this.librariesRepository.update(id, updateLibraryDto);
  }

  async remove(id: string) {
    const library = await this.librariesRepository.findOne('id', id);
    if (!library) throw new NotFoundException();
    await this.librariesRepository.remove(id);
    return { message: 'Library removed.' };
  }
}
