import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { GetBookDto } from './dto/get-book.dto';
import { DeleteBookDto } from './dto/delete-book.dto';

@Controller('books')
@UsePipes(ValidationPipe)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(@Query() { limit, skip }: { limit: string; skip: string }) {
    return this.booksService.findAll(limit, skip);
  }

  @Get(':id')
  findOne(@Param() { id }: GetBookDto) {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(@Param() { id }: UpdateBookDto, @Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param() { id }: DeleteBookDto) {
    return this.booksService.remove(id);
  }
}
