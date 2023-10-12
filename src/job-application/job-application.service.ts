import { Injectable } from '@nestjs/common';

import { JobApplication } from '../entity/job-application.entity';
import { JobApplicationRepository } from '../repository/job-application.repository';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}
  register(userId: number, jobPostingId: number): Promise<JobApplication> {
    const jobApplication = new JobApplication();
    jobApplication.applicantId = userId;
    jobApplication.jobPostingId = jobPostingId;

    return this.jobApplicationRepository.save(jobApplication);
  }
}
