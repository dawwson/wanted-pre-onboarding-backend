import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { JobPosting } from '../entity/job-posting.entity';

@Injectable()
export class JobPostingRepository extends Repository<JobPosting> {
  constructor(dataSource: DataSource) {
    super(JobPosting, dataSource.createEntityManager());
  }

  findWithCompany(): Promise<JobPosting[]> {
    // LEFT JOIN company ON company.id = job_posting.company_id
    return this.find({
      // SELECT company.id, company.name, company.country, company.region
      select: {
        company: { id: true, name: true, country: true, region: true },
      },
      relations: { company: true },
    });
  }

  findWithCompanyBySearch(search: string): Promise<JobPosting[]> {
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

  findWithCompanyById(id: number): Promise<JobPosting> {
    return this.findOne({
      // SELECT company.id, company.name, company.country, company.region
      select: {
        company: { id: true, name: true, country: true, region: true },
      },
      // LEFT JOIN company ON company.id = job_posting.company_id
      relations: { company: true },
      // WHERE job_posting_id IN (:id) <- equal(=)이 안 됨
      where: { id },
    });
  }

  findByCompanyId(companyId: number): Promise<JobPosting[]> {
    return this.find({
      // SELECT job_posting.id
      select: { id: true },
      // WHERE company.id = :companyId
      where: { company: { id: companyId } },
    });
  }
}
