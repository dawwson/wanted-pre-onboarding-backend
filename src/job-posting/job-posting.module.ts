import { Module } from '@nestjs/common';

import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';

import { UserService } from '../user/user.service';
import { JobPostingRepository } from '../repository/job-posting.repository';
import { CompanyRepository } from '../repository/company.repository';
import { UserRepository } from '../repository/user.repository';
import { DynamicRepositoryModule } from '../repository/dynamic-repository.module';

@Module({
  imports: [
    DynamicRepositoryModule.forRepository([
      JobPostingRepository,
      CompanyRepository,
      UserRepository,
    ]),
  ],
  controllers: [JobPostingController],
  providers: [JobPostingService, UserService],
})
export class JobPostingModule {}
