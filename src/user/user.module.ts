import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { JobPostingRepository } from '../repository/job-posting.repository';
import { UserRepository } from '../repository/user.repository';
import { DynamicRepositoryModule } from '../repository/dynamic-repository.module';

@Module({
  imports: [
    DynamicRepositoryModule.forRepository([
      UserRepository,
      JobPostingRepository,
    ]),
  ],
  providers: [UserService, UserRepository, JobPostingRepository],
  exports: [UserService],
})
export class UserModule {}
