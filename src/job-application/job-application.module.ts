import { Module } from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationRepository } from '../repository/job-application.repository';

@Module({
  controllers: [JobApplicationController],
  providers: [JobApplicationService, JobApplicationRepository],
})
export class JobApplicationModule {}
