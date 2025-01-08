import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { GetAuthorDto } from './dto/get-author.dto';
import { DeleteAuthorDto } from './dto/delete-author.dto';

@Controller('authors')
@UsePipes(ValidationPipe)
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto) {
    return this.authorsService.create(createAuthorDto);
  }

  @Get()
  findAll() {
    return this.authorsService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: GetAuthorDto) {
    return this.authorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param() { id }: UpdateAuthorDto,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ) {
    return this.authorsService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  remove(@Param() { id }: DeleteAuthorDto) {
    return this.authorsService.remove(id);
  }
}
