import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('users')
@UsePipes(ValidationPipe)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Query('validation_code') validationCode?: string) {
    return this.usersService.create(createUserDto, validationCode);
  }

  @Get(':id')
  findOne(@Param() { id }: GetUserDto) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: UpdateUserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() { id }: DeleteUserDto) {
    return this.usersService.remove(id);
  }
}
