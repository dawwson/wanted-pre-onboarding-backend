import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JobPostingController } from './job-posting.controller';
import { JobPostingService } from './job-posting.service';
import { JobPosting } from '../entity/job-posting.entity';
import { Company } from '../entity/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobPosting, Company])],
  controllers: [JobPostingController],
  providers: [JobPostingService],
})
export class JobPostingModule {}
