import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { JobPosting } from '../entity/job-posting.entity';

@Injectable()
export class JobPostingRepository extends Repository<JobPosting> {
  constructor(dataSource: DataSource) {
    super(JobPosting, dataSource.createEntityManager());
  }

  findWithCompany() {
    // LEFT JOIN company ON company.id = job_posting.company_id
    return this.find({
      // SELECT company.id, company.name, company.country, company.region
      select: {
        company: { id: true, name: true, country: true, region: true },
      },
      relations: { company: true },
    });
  }

  findWithCompanyBySearch(search: string) {
    return this.find({
      // SELECT company.id, company.name, company.country, company.region
      select: {
        company: { id: true, name: true, country: true, region: true },
      },
      // LEFT JOIN company ON company.id = job_posting.company_id
      relations: { company: true },
      // WHERE (company.name = :search) OR (company.skill = :search)
      where: [{ company: { name: search } }, { skill: search }],
    });
  }
}
