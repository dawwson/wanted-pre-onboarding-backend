import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

// NOTE: Middleware -> Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    // 엔드포인트에 지정된 role이 없으면 통과
    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();

    // 현재 회원의 role과 일치하면 통과
    return roles.includes(req.user.role);
  }
}
