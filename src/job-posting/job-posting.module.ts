import { Module } from '@nestjs/common';

import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';

import { UserService } from '../user/user.service';
import { JobPostingRepository } from '../repository/job-posting.repository';
import { CompanyRepository } from '../repository/company.repository';
import { UserRepository } from '../repository/user.repository';

@Module({
  controllers: [JobPostingController],
  providers: [
    JobPostingService,
    UserService,
    JobPostingRepository,
    CompanyRepository,
    UserRepository,
  ],
})
export class JobPostingModule {}
