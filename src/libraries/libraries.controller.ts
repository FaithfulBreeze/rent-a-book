import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { AuthGuard } from 'common/guards/auth/auth.guard';
import { User } from 'common/decorators/user/user.decorator';
import { Library } from 'common/decorators/library/library.decorator';
import { LibraryGuard } from 'common/guards/library/library.guard';

@Controller('libraries')
@UsePipes(ValidationPipe)
export class LibrariesController {
  constructor(private readonly librariesService: LibrariesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createLibraryDto: CreateLibraryDto, @User() userId: string) {
    return this.librariesService.create(createLibraryDto, userId);
  }

  @Get()
  findAll(@Query('limit') limit: string, @Query('offset') offset: string) {
    return this.librariesService.findAll(+limit, +offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.librariesService.findOne(id);
  }

  @Patch()
  @UseGuards(AuthGuard, LibraryGuard)
  update(@Library() id: string, @Body() updateLibraryDto: UpdateLibraryDto) {
    return this.librariesService.update(id, updateLibraryDto);
  }

  @Delete()
  @UseGuards(AuthGuard, LibraryGuard)
  remove(@Library() id: string) {
    return this.librariesService.remove(id);
  }
}
