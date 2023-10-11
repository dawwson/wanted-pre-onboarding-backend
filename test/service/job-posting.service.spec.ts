import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { JobPostingRepository } from '../../src/repository/job-posting.repository';
import { CompanyRepository } from '../../src/repository/company.repository';

import { PostJobPostingDto } from '../../src/job-posting/controller-dto/post-job-posting.dto';
import { JobPosting } from '../../src/entity/job-posting.entity';
import { Company } from '../../src/entity/company.entity';

import { JobPostingService } from '../../src/job-posting/job-posting.service';

describe('JobPostingService', () => {
  type MockRepository<T = any> = Partial<
    Record<keyof Repository<T>, jest.Mock>
  >;

  let jobPostingService: JobPostingService;
  let jobPostingRepository: MockRepository<JobPosting>;
  let companyRepository: MockRepository<Repository<Company>>;

  const mockJobPostingRepository = {
    save: jest.fn(),
  };
  const mockCompanyRepository = {
    findByManagerId: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        JobPostingService,
        // 모킹된 객체를 제공
        {
          provide: JobPostingRepository,
          useValue: mockJobPostingRepository,
        },
        {
          provide: CompanyRepository,
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    jobPostingService = module.get(JobPostingService);
    jobPostingRepository = module.get(JobPostingRepository);
    companyRepository = module.get(CompanyRepository);
  });

  it('should be defined', () => {
    expect(jobPostingService).toBeDefined();
    expect(jobPostingRepository).toBeDefined();
  });

  test('채용공고 등록 : 성공 시 등록된 채용공고 객체를 반환한다.', async () => {
    // given
    // 테스트 회원 id
    const testUserId: number = 1;
    // 테스트 dto
    const testPostJobPostingDto: PostJobPostingDto = {
      jobPosition: '백엔드 개발자',
      description: '채용 서비스를 개발합니다!',
      reward: 1000000,
      skill: 'nodejs',
    };

    // 의존성의 가짜 반환값 => 실제 DB에 접근하지 않도록 하기 위함.
    jobPostingRepository.save.mockResolvedValue({
      id: 1,
      jobPosition: '백엔드 개발자',
      description: '채용 서비스를 개발합니다!',
      reward: 1000000,
      skill: 'nodejs',
      createdAt: '2023-10-09T19:40:58.200Z',
      updatedAt: '2023-10-09T19:40:58.200Z',
    });

    // when
    const result = await jobPostingService.register(
      testUserId,
      testPostJobPostingDto,
    );

    // then
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('jobPosition');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('reward');
    expect(result).toHaveProperty('skill');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
  });
});
