import { Module } from '@nestjs/common';

import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';

import { JobPostingRepository } from '../repository/job-posting.repository';
import { CompanyRepository } from '../repository/company.repository';

@Module({
  controllers: [JobPostingController],
  providers: [JobPostingService, JobPostingRepository, CompanyRepository],
})
export class JobPostingModule {}
