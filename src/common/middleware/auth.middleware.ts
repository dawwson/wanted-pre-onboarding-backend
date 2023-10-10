import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';

import { UserService } from '../../user/user.service';
import { RequestWithUser } from '../interface/request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    // NOTE: < Authorization: userId=xxx > 형식의 헤더 검증
    const authorization = req.headers['authorization'];
    const userId = parseInt(authorization.split(' ')[1]);

    const user = await this.userService.getUser(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    req.user = user;
    next();
  }
}
