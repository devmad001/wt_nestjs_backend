import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/users/schemas/user.schema';
import { IS_PUBLIC_KEY } from './../decorators/public.decorator';

@Injectable()
export class TechOwnerGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException('Access Denied.');
    }
    if (user.role !== UserRole.TECHOWNER) {
      throw new UnauthorizedException(
        'Only Techowner is allowed to perform this action.',
      );
    }
    return user;
  }
}
