import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';

import { UserService } from '../../api/user/user.service';
import { RequestWithUser } from '../interface/request.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    // NOTE: < Authorization: userId=xxx > 형식의 헤더 검증
    // 이 헤더 값의 유효성 검증은 생략함.
    const authorization = req.headers['authorization'];
    const userId = parseInt(authorization.split(' ')[1]);

    const user = await this.userService.getOne(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid user');
    }

    // 요청 객체에 붙여서 다음 미들웨어/가드로 넘긴다.
    req.user = user;
    next();
  }
}
