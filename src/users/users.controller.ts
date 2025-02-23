import { Controller, Get, Post, Body, Patch, Delete, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'guards/auth/auth.guard';
import { User } from 'decorators/user/user.decorator';

@Controller('users')
@UsePipes(ValidationPipe)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto, @Query('validation_code') validationCode: string) {
    return this.usersService.create(createUserDto, validationCode);
  }

  @Get()
  @UseGuards(AuthGuard)
  findOne(@User() id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(@User() id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  remove(@User() id: string) {
    return this.usersService.remove(id);
  }
}
