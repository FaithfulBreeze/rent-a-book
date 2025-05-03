import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from 'jwt/jwt.service';
import { UsersRepository } from 'users/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.cookies.jwt) return false;
    const payload = this.jwtService.verifyToken(req.cookies.jwt);
    if (payload) {
      const { accessToken } = await this.usersRepository.findOne('id', payload.id);
      if (accessToken != req.cookies.jwt) return false;
      req.user = payload.id;
    }
    return !!payload;
  }
}
