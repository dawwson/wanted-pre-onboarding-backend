import { Test, TestingModule } from '@nestjs/testing';

import { JobPostingRepository } from '../../src/repository/job-posting.repository';
import { CompanyRepository } from '../../src/repository/company.repository';

import { PostJobPostingDto } from '../../src/api/job-posting/controller-dto/post-job-posting.dto';
import { JobPosting } from '../../src/entity/job-posting.entity';

import { JobPostingService } from '../../src/api/job-posting/job-posting.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('JobPostingService', () => {
  let jobPostingService: JobPostingService;
  let jobPostingRepository: JobPostingRepository;
  let companyRepository: CompanyRepository;

  // Mock Repository
  // DB 연결 없이 레파지토리와 독립적으로 service를 테스트하기 위함
  const mockJobPostingRepository = {
    save: jest.fn(),
  };
  const mockCompanyRepository = {
    findByManagerId: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobPostingService,
        // 모킹된 Repository를 제공
        {
          provide: getRepositoryToken(JobPostingRepository),
          useValue: mockJobPostingRepository,
        },
        {
          provide: getRepositoryToken(CompanyRepository),
          useValue: mockCompanyRepository,
        },
      ],
    }).compile();

    jobPostingService = module.get(JobPostingService);
    jobPostingRepository = module.get<JobPostingRepository>(
      getRepositoryToken(JobPostingRepository),
    );
    companyRepository = module.get<CompanyRepository>(
      getRepositoryToken(CompanyRepository),
    );
  });

  it('should be defined', () => {
    expect(jobPostingService).toBeDefined();
    expect(jobPostingRepository).toBeDefined();
  });

  test('register() : 등록된 채용공고 엔티티를 반환한다.', async () => {
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
    const mockRepoValue = {
      id: testUserId,
      jobPosition: '백엔드 개발자',
      description: '채용 서비스를 개발합니다!',
      reward: 1000000,
      skill: 'nodejs',
    } as JobPosting;

    // 의존성의 가짜 반환값 => 실제 DB에 접근하지 않도록 하기 위함.
    jest.spyOn(jobPostingRepository, 'save').mockResolvedValue(mockRepoValue);

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
