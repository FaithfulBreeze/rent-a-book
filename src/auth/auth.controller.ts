import { Body, Controller, HttpCode, Post, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AppendTokenInterceptor } from 'common/interceptors/append-token/append-token.interceptor';

@Controller('auth')
@UsePipes(ValidationPipe)
@UseInterceptors(AppendTokenInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
