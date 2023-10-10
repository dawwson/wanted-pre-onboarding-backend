import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { Role, User } from '../../entity/user.entity';
import { Company } from '../../entity/company.entity';

export default class TestDataSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    // 테이블 데이터 초기화(스키마 유지)
    await dataSource.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');

    const userRepository = dataSource.getRepository(User);
    const companyRepository = dataSource.getRepository(Company);

    // 기업 회원
    const corporateUser = new User();
    corporateUser.email = 'test1@gmail.com';
    corporateUser.password = '1234';
    corporateUser.name = 'test1';
    corporateUser.role = Role.CORPORATE;

    // 개인 회원
    const individualUser = new User();
    individualUser.email = 'test2@gmail.com';
    individualUser.password = '1234';
    individualUser.name = 'test2';
    individualUser.role = Role.INDIVIDUAL;

    // 회사
    const company = new Company();
    company.manager = corporateUser;
    company.name = '원티드';
    company.country = '한국';
    company.region = '서울';

    await userRepository.save([corporateUser, individualUser]);
    await companyRepository.save(company);
  }
}
