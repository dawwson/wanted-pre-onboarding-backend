import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { JobApplication } from '../entity/job-application.entity';

@Injectable()
export class JobApplicationRepository extends Repository<JobApplication> {
  constructor(dataSource: DataSource) {
    super(JobApplication, dataSource.createEntityManager());
  }
}
