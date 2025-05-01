import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { JwtService } from 'jwt/jwt.service';
import { Observable, tap } from 'rxjs';
import { UsersRepository } from 'users/users.repository';

@Injectable()
export class AppendTokenInterceptor implements NestInterceptor {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(({ id }) => {
        const res = context.switchToHttp().getResponse();
        const token = this.jwtService.generateToken(id);
        this.usersRepository.update(id, { accessToken: token });
        res.cookie('jwt', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        });
      }),
    );
  }
}
