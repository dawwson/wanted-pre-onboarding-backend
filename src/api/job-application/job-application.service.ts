import { ConflictException, Injectable } from '@nestjs/common';

import { JobApplication } from '../../entity/job-application.entity';
import { JobApplicationRepository } from '../../repository/job-application.repository';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  async register(
    applicantId: number,
    jobPostingId: number,
  ): Promise<JobApplication> {
    const jobApplication = JobApplication.create(applicantId, jobPostingId);

    try {
      return await this.jobApplicationRepository.save(jobApplication);
    } catch (error) {
      // psql duplicate key error에 대한 예외처리
      if (error.code === '23505') {
        throw new ConflictException('이미 지원한 내역이 있습니다.');
      }
    }
  }
}
