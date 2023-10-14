import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import {
  JobApplication,
  JobApplicationStatus,
} from '../entity/job-application.entity';

@Injectable()
export class JobApplicationRepository extends Repository<JobApplication> {
  constructor(dataSource: DataSource) {
    super(JobApplication, dataSource.createEntityManager());
  }

  findAppliedByJobPostingId(jobPostingId: number): Promise<JobApplication[]> {
    return this.find({
      where: {
        jobPosting: { id: jobPostingId },
        status: JobApplicationStatus.APPLIED,
      },
    });
  }
}
