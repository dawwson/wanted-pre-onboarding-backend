import { Request } from 'express';
import { User } from '../../entity/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}
