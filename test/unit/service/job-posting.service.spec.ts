import { Test, TestingModule } from '@nestjs/testing';

import { JobPostingRepository } from '../../../src/repository/job-posting.repository';
import { JobApplicationRepository } from '../../../src/repository/job-application.repository';

import { PostJobPostingDto } from '../../../src/api/job-posting/controller-dto/post-job-posting.dto';
import { JobPosting } from '../../../src/entity/job-posting.entity';

import { JobPostingService } from '../../../src/api/job-posting/job-posting.service';
import { PatchJobPostingDto } from '../../../src/api/job-posting/controller-dto/patch-job-posting.dto';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';

describe('JobPostingService', () => {
  let jobPostingService: JobPostingService;
  let jobPostingRepository: JobPostingRepository;
  let jobApplicationRepository: JobApplicationRepository;

  const mockJobPostingRepository = {
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockJobApplicationRepository = {
    findAppliedByJobPostingId: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobPostingService,
        {
          provide: JobPostingRepository,
          useValue: mockJobPostingRepository,
        },
        {
          provide: JobApplicationRepository,
          useValue: mockJobApplicationRepository,
        },
      ],
    }).compile();

    jobPostingService = module.get(JobPostingService);
    jobPostingRepository =
      module.get<JobPostingRepository>(JobPostingRepository);
    jobApplicationRepository = module.get<JobApplicationRepository>(
      JobApplicationRepository,
    );
  });

  it('should be defined', () => {
    expect(jobPostingService).toBeDefined();
    expect(jobPostingRepository).toBeDefined();
  });

  test('register() : 등록된 JobPosting을 반환한다.', async () => {
    // given
    const testUserId: number = 1;

    const testPostJobPostingDto: PostJobPostingDto = {
      jobPosition: '백엔드 개발자',
      description: '채용 서비스를 개발합니다!',
      reward: 1000000,
      skill: 'nodejs',
    };

    const mockJobPosting = {
      id: testUserId,
      companyId: 1,
      jobPosition: '백엔드 개발자',
      description: '채용 서비스를 개발합니다!',
      reward: 1000000,
      skill: 'nodejs',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as JobPosting;

    const saveSpy = jest
      .spyOn(jobPostingRepository, 'save')
      .mockResolvedValue(mockJobPosting);

    // when
    const result = await jobPostingService.register(
      testUserId,
      testPostJobPostingDto,
    );

    // then
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockJobPosting);
  });

  test('update() : 수정된 JobPosting의 수를 반환한다.', async () => {
    // given
    const testJobPostingId: number = 1;

    const testPatchJobPostingDto = {
      jobPosition: '수정할 채용 포지션',
      description: '수정할 채용 내용',
      reward: 20000,
      skill: '수정할 사용 기술',
    } as PatchJobPostingDto;

    const mockUpdateResult = {
      affected: 1,
    } as UpdateResult;

    const updateSpy = jest
      .spyOn(jobPostingRepository, 'update')
      .mockResolvedValue(mockUpdateResult);

    // when
    const result = await jobPostingService.update(
      testJobPostingId,
      testPatchJobPostingDto,
    );

    // then
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(result.affected).toBe(1);
  });

  test('remove() : 삭제된 JobPosting의 수를 반환한다.', async () => {
    // given
    // when
    // const result = await jobPostingService.remove();
    // then
  });

  describe('getAll()', () => {
    test('검색 조건 없이 모든 JobPosting 객체 배열을 반환한다.', async () => {
      // given
      // when
      // const result = await jobPostingService.getAll();
      // then
    });

    test('검색 조건 포함 모든 JobPosting 객체 배열을 반환한다.', async () => {
      // given
      // when
      // const result = await jobPostingService.getAll();
      // then
    });
  });

  describe('getOne()', () => {
    test('getOne() : id에 해당하는 JobPosting 객체를 반환한다.', async () => {
      // given
      // when
      // const result = await jobPostingService.getOne();
      // then
    });

    test('getOne() : JobPosting이 없으면 에러가 발생한다.', async () => {
      // given
      // when
      // const result = await jobPostingService.getOne();
      // then
    });
  });

  test('getAllOfCompany() : id에 해당하는 JobPosting 객체를 반환한다.', async () => {
    // given
    // when
    // const result = await jobPostingService.getAll();
    // then
  });
});
