import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { JobPostingRepository } from '../repository/job-posting.repository';
import { UserRepository } from '../repository/user.repository';

@Module({
  providers: [UserService, UserRepository, JobPostingRepository],
  exports: [UserService],
})
export class UserModule {}
