import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class AppendTokenInterceptor implements NestInterceptor {
  constructor(private readonly jwtService: JwtService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((id) => {
        const res = context.switchToHttp().getResponse();
        res.cookie('jwt', this.jwtService.generateToken(id), {
          httpOnly: true,
          maxAge: 1000 * 60 * 60,
        });
      }),
    );
  }
}