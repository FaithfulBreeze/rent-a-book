import { Controller, Get, Post, Body, Delete, UseGuards, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { AuthGuard } from 'common/guards/auth/auth.guard';
import { User } from 'common/decorators/user/user.decorator';
import { AuthorGuard } from 'common/guards/author/author.guard';
import { Author } from 'common/decorators/author/author.decorator';

@Controller('authors')
@UsePipes(ValidationPipe)
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAuthorDto: CreateAuthorDto, @User() userId: string) {
    return this.authorsService.create(createAuthorDto, userId);
  }

  @Get()
  findAll(@Query('limit') limit: string, @Query('offset') offset: string) {
    return this.authorsService.findAll(+limit, +offset);
  }

  @UseGuards(AuthGuard, AuthorGuard)
  @Get('self')
  findOne(@Author() id: string) {
    return this.authorsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@User() id: string) {
    return this.authorsService.remove(id);
  }
}
