import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { JobPosting } from '../entity/job-posting.entity';

@Injectable()
export class JobPostingRepository extends Repository<JobPosting> {
  constructor(dataSource: DataSource) {
    super(JobPosting, dataSource.createEntityManager());
  }
}
