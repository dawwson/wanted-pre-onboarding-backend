import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Company } from '../entity/company.entity';

@Injectable()
export class CompanyRepository extends Repository<Company> {
  constructor(dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }

  findByManagerId(managerId: number) {
    return this.findOneBy({ manager: { id: managerId } });
  }
}
