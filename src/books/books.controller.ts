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
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AuthGuard } from 'common/guards/auth/auth.guard';
import { Author } from 'common/decorators/author/author.decorator';
import { AuthorGuard } from 'common/guards/author/author.guard';
import { Response } from 'express';

@Controller('books')
@UsePipes(ValidationPipe)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(AuthGuard, AuthorGuard)
  create(@Body() createBookDto: CreateBookDto, @Author() authorId: string) {
    return this.booksService.create(createBookDto, authorId);
  }

  @Get()
  findAll(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('author') author: string,
    @Query('name') name: string,
    @Query('include-author') includeAuthor: boolean,
  ) {
    return this.booksService.findAll(+limit, +offset, author, name, includeAuthor);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Query('file') file: boolean, @Res() res: Response) {
    const foundBook = await this.booksService.findOne(id, file);
    //eslint-disable-next-line  @typescript-eslint/no-unused-expressions
    file ? res.sendFile(foundBook as string) : res.json(foundBook);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, AuthorGuard)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @Author() authorId: string) {
    return this.booksService.update(id, updateBookDto, authorId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, AuthorGuard)
  remove(@Param('id') id: string, @Author() authorId: string) {
    return this.booksService.remove(id, authorId);
  }
}
