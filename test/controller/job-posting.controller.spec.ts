import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestWithUser } from '../../src/common/interface/request.interface';

import { JobPosting } from '../../src/entity/job-posting.entity';

import { CompanyRepository } from '../../src/repository/company.repository';
import { UserRepository } from '../../src/repository/user.repository';
import { JobPostingRepository } from '../../src/repository/job-posting.repository';

import { UserService } from '../../src/api/user/user.service';

import { PostJobPostingDto } from '../../src/api/job-posting/controller-dto/post-job-posting.dto';
import { JobPostingController } from '../../src/api/job-posting/job-posting.controller';
import { JobPostingService } from '../../src/api/job-posting/job-posting.service';

describe('JobPostingController', () => {
  let jobPostingController: JobPostingController;
  let jobPostingService: JobPostingService;

  const mockJobPostingService = {
    register: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findAllOfCompany: jest.fn(),
  };
  const mockUserService = {
    checkCanUpdateJobPosting: jest.fn(),
    checkCanDeleteJobPosting: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostingController],
      providers: [
        // 필요한 프로바이더를 모킹한 값으로 넣어준다.
        {
          provide: JobPostingService,
          useValue: mockJobPostingService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: getRepositoryToken(JobPostingRepository),
          useValue: Repository,
        },
        {
          provide: getRepositoryToken(CompanyRepository),
          useValue: Repository,
        },
        {
          provide: getRepositoryToken(UserRepository),
          useValue: Repository,
        },
      ],
    }).compile();

    jobPostingController =
      module.get<JobPostingController>(JobPostingController);
    jobPostingService = module.get<JobPostingService>(JobPostingService);
  });

  it('should be defined', () => {
    expect(jobPostingController).toBeDefined();
    expect(jobPostingService).toBeDefined();
  });

  test('registerJobPosting() : 생성된 채용공고 id를 반환한다.', async () => {
    // given
    const testJobPostingId: number = 1;

    // 1. Mock Request 객체
    const mockRequest = {
      user: { id: 1 },
    } as RequestWithUser;

    // 2. Mock Dto 객체
    const testDto = {
      jobPosition: 'test position',
      description: 'test description',
      reward: 10000,
      skill: 'test skill',
    } as PostJobPostingDto;

    // 3. Service 레이어 Mocking(필요한 값을 반환한다고 가정함)
    const jobPostingServiceSpy = jest
      .spyOn(jobPostingService, 'register')
      .mockResolvedValue({
        id: testJobPostingId,
      } as JobPosting);

    // when
    const response = await jobPostingController.registerJobPosting(
      mockRequest,
      testDto,
    );

    // then
    expect(jobPostingServiceSpy).toHaveBeenCalled();
    expect(response.message).toBeDefined();
    expect(response.jobPosting.id).toBe(testJobPostingId);
  });

  test('updateJobPosting() : 수정된 채용공고 id를 반환한다.', () => {
    // given
    // when
    // then
  });

  test('removeJobPosting() : 생성된 채용공고 id를 반환한다.', () => {
    // given
    // when
    // then
  });

  test('getJobPosting() : 생성된 채용공고 id를 반환한다.', () => {
    // given
    // when
    // then
  });

  test('getDetailJobPosting() : 생성된 채용공고 id를 반환한다.', () => {
    // given
    // when
    // then
  });
});
