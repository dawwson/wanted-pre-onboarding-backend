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
import { UpdateResultDto } from '../../src/api/job-posting/service-dto/update-result.dto';
import { raw } from 'express';
import { PatchJobPostingDto } from '../../src/api/job-posting/controller-dto/patch-job-posting.dto';

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
  });

  test('registerJobPosting() : 생성된 채용공고 id를 반환한다.', async () => {
    // given
    // 1. 테스트 채용공고 Id
    const testJobPostingId: number = 1;

    // 2. 테스트 Request 객체
    const testRequest = {
      user: { id: 1 },
    } as RequestWithUser;

    // 3. 테스트 요청 DTO 객체
    const testDto = {
      jobPosition: 'test position',
      description: 'test description',
      reward: 10000,
      skill: 'test skill',
    } as PostJobPostingDto;

    // 4. Service 레이어 Mocking(필요한 값을 반환한다고 가정함)
    const jobPostingServiceSpy = jest
      .spyOn(jobPostingService, 'register')
      .mockResolvedValue({
        id: testJobPostingId,
      } as JobPosting);

    // when
    const response = await jobPostingController.registerJobPosting(
      testRequest,
      testDto,
    );

    // then
    expect(jobPostingServiceSpy).toHaveBeenCalled();
    expect(response.message).toBeDefined();
    expect(response.jobPosting.id).toBe(testJobPostingId);
  });

  test('updateJobPosting() : 수정된 채용공고 id를 반환한다.', async () => {
    // given
    // 1. 테스트 채용공고 Id
    const testJobPostingId: string = '1';

    // 2. 테스트 Request 객체
    const testRequest = {
      user: { id: 1 },
    } as RequestWithUser;

    // 3. 테스트 요청 DTO 객체
    const testDto = {
      jobPosition: '수정할 채용 포지션',
      description: '수정할 채용 내용',
      reward: 10000,
      skill: '수정할 사용 기술',
    } as PatchJobPostingDto;

    // 4. Service 레이어 Mocking(필요한 값을 반환한다고 가정함)
    const jobPostingServiceSpy = jest
      .spyOn(jobPostingService, 'update')
      .mockResolvedValue({
        affected: 1,
      } as UpdateResultDto);

    // when
    const response = await jobPostingController.updateJobPosting(
      testRequest,
      testJobPostingId,
      testDto,
    );

    // then
    expect(jobPostingServiceSpy).toHaveBeenCalled();
    expect(response.message).toBeDefined();
    expect(response.jobPosting.id).toBe(testJobPostingId);
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
