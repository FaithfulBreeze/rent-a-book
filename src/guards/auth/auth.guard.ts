import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'jwt/jwt.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.cookies.jwt) return false;
    const payload = this.jwtService.verifyToken(req.cookies.jwt);
    if (payload) req.user = payload.id;
    return !!payload;
  }
}
