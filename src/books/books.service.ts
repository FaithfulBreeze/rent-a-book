import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { randomUUID } from 'crypto';
import { AuthorsRepository } from 'authors/authors.repository';
import { BooksRepository } from './books.repository';
import { PdfService } from 'pdf/pdf.service';

@Injectable()
export class BooksService {
  constructor(
    private readonly booksRepository: BooksRepository,
    private readonly pdfService: PdfService,
    private readonly authorsRepository: AuthorsRepository,
  ) {}
  async create(createBookDto: CreateBookDto, authorId: string) {
    const author = await this.authorsRepository.findOne('id', authorId);
    const filename = await this.pdfService.generate(createBookDto, author, randomUUID());
    return await this.booksRepository.create({ ...createBookDto, filename, authorId });
  }

  async findAll(limit?: number, offset?: number, author?: string, name?: string, includeAuthor?: boolean) {
    return this.booksRepository.findAll(limit, offset, author, name, includeAuthor);
  }

  async findOne(id: string, file: boolean) {
    const foundBook = await this.booksRepository.findOne('id', id);
    return file ? this.pdfService.getPath(foundBook.filename) : foundBook;
  }

  async update(id: string, updateBookDto: UpdateBookDto, authorId: string) {
    const foundBook = await this.booksRepository.findOne('id', id);
    if (!foundBook) throw new NotFoundException(`Book with id ${id} not found`);
    if (foundBook.authorId !== authorId) throw new ForbiddenException();
    const author = await this.authorsRepository.findOne('id', foundBook.authorId);
    await this.pdfService.remove(foundBook.filename);
    await this.pdfService.generate({ ...foundBook, ...updateBookDto }, author, foundBook.filename);
    return this.booksRepository.update(id, updateBookDto);
  }

  async remove(id: string, authorId: string) {
    const foundBook = await this.booksRepository.findOne('id', id);
    if (!foundBook) throw new NotFoundException(`Book with id ${id} not found`);
    if (foundBook.authorId !== authorId) throw new ForbiddenException();
    return this.booksRepository.remove(id);
  }
}
