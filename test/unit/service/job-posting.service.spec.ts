import { Test, TestingModule } from '@nestjs/testing';
import { DeleteResult, UpdateResult } from 'typeorm';

import { PostJobPostingDto } from '../../../src/api/job-posting/controller-dto/post-job-posting.dto';
import { JobPostingService } from '../../../src/api/job-posting/job-posting.service';
import { PatchJobPostingDto } from '../../../src/api/job-posting/controller-dto/patch-job-posting.dto';
import { FindConditionDto } from '../../../src/api/job-posting/service-dto/find-condition.dto';

import { Company } from '../../../src/entity/company.entity';
import { JobPosting } from '../../../src/entity/job-posting.entity';

import { JobPostingRepository } from '../../../src/repository/job-posting.repository';
import { JobApplicationRepository } from '../../../src/repository/job-application.repository';

import {
  JobApplication,
  JobApplicationStatus,
} from '../../../src/entity/job-application.entity';
import { NotFoundException } from '@nestjs/common';

describe('JobPostingService', () => {
  let jobPostingService: JobPostingService;
  let jobPostingRepository: JobPostingRepository;
  let jobApplicationRepository: JobApplicationRepository;

  const mockJobPostingRepository = {
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findWithCompany: jest.fn(),
    findWithCompanyBySearch: jest.fn(),
    findWithCompanyById: jest.fn(),
    findByCompanyId: jest.fn(),
  };

  const mockJobApplicationRepository = {
    findAppliedByJobPostingId: jest.fn(),
    save: jest.fn(),
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });

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

  describe('remove()', () => {
    test('삭제된 JobPosting의 수를 반환한다. - 연관된 JobApplication이 없는 경우', async () => {
      // given
      const testJobPostingId: number = 1;

      const mockAppliedJobApplications = [];

      const findAppliedByJobPostingIdSpy = jest
        .spyOn(jobApplicationRepository, 'findAppliedByJobPostingId')
        .mockResolvedValue(mockAppliedJobApplications);

      const mockDeleteResult = {
        affected: 1,
      } as DeleteResult;

      const deleteSpy = jest
        .spyOn(jobPostingRepository, 'delete')
        .mockResolvedValue(mockDeleteResult);

      // when
      const result = await jobPostingService.remove(testJobPostingId);

      // then
      expect(findAppliedByJobPostingIdSpy).toHaveBeenCalledTimes(1);
      expect(findAppliedByJobPostingIdSpy).toHaveBeenCalledWith(
        testJobPostingId,
      );

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(testJobPostingId);

      expect(result.affected).toBe(1);

      // 다음 테스트에 영향을 주지 않기 위해 spy 모킹 해제
      findAppliedByJobPostingIdSpy.mockRestore();
      deleteSpy.mockRestore();
    });

    test('remove() : 삭제된 JobPosting의 수를 반환한다. - 연관된 JobApplication이 있는 경우', async () => {
      // given
      const testJobPostingId: number = 1;

      const mockAppliedJobApplications = [
        {
          id: 2,
          jobPostingId: testJobPostingId,
          applicantId: 3,
          status: JobApplicationStatus.APPLIED,
          createdAt: new Date(),
          updatedAt: new Date(),
          changeToRejected: () => {},
        },
        {
          id: 4,
          jobPostingId: testJobPostingId,
          applicantId: 5,
          status: JobApplicationStatus.APPLIED,
          createdAt: new Date(),
          updatedAt: new Date(),
          changeToRejected: () => {},
        },
      ] as JobApplication[];

      const findAppliedByJobPostingIdSpy = jest
        .spyOn(jobApplicationRepository, 'findAppliedByJobPostingId')
        .mockResolvedValue(mockAppliedJobApplications);

      const saveSpy = jest.spyOn(jobApplicationRepository, 'save');

      const deleteSpy = jest
        .spyOn(jobPostingRepository, 'delete')
        .mockResolvedValue({
          affected: 1,
        } as DeleteResult);

      // when
      const result = await jobPostingService.remove(testJobPostingId);

      // then
      expect(findAppliedByJobPostingIdSpy).toHaveBeenCalledTimes(1);
      expect(findAppliedByJobPostingIdSpy).toHaveBeenCalledWith(
        testJobPostingId,
      );

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(mockAppliedJobApplications);

      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(deleteSpy).toHaveBeenCalledWith(testJobPostingId);

      expect(result.affected).toBe(1);
    });
  });

  describe('getAll()', () => {
    test('검색 조건 없이 모든 JobPosting 객체 배열을 반환한다.', async () => {
      // given
      const testFindConditionDto = {
        search: null,
      } as FindConditionDto;

      const mockJobPostings = [
        {
          id: 1,
          company: {
            id: 1,
            name: '원티드',
            country: '한국',
            region: '서울',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Company,
          jobPosition: '개발자',
          description: '성실한 개발자를 찾습니다!',
          reward: 10000,
          skill: 'node.js',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          company: {
            id: 1,
            name: '원티드',
            country: '한국',
            region: '서울',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Company,
          jobPosition: '디자이너',
          description: '성실한 디자이너를 찾습니다!',
          reward: 20000,
          skill: 'photoshop',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as JobPosting[];

      const findWithCompanySpy = jest
        .spyOn(jobPostingRepository, 'findWithCompany')
        .mockResolvedValue(mockJobPostings);

      // when
      const result = await jobPostingService.getAll(testFindConditionDto);

      // then
      expect(findWithCompanySpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockJobPostings);
    });

    test('검색 조건 포함 모든 JobPosting 객체 배열을 반환한다.', async () => {
      // given
      const testFindConditionDto = {
        search: '원',
      } as FindConditionDto;

      const mockJobPostings = [
        {
          id: 1,
          company: {
            id: 1,
            name: '원티드',
            country: '한국',
            region: '서울',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Company,
          jobPosition: '개발자',
          description: '성실한 개발자를 찾습니다!',
          reward: 10000,
          skill: 'node.js',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          company: {
            id: 1,
            name: '원티드',
            country: '한국',
            region: '서울',
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Company,
          jobPosition: '디자이너',
          description: '성실한 디자이너를 찾습니다!',
          reward: 20000,
          skill: 'photoshop',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as JobPosting[];

      const findWithCompanyBySearchSpy = jest
        .spyOn(jobPostingRepository, 'findWithCompanyBySearch')
        .mockResolvedValue(mockJobPostings);

      // when
      const result = await jobPostingService.getAll(testFindConditionDto);

      // then
      expect(findWithCompanyBySearchSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockJobPostings);
    });
  });

  describe('getOne()', () => {
    test('getOne() : id에 해당하는 JobPosting 객체를 반환한다.', async () => {
      // given
      const testJobPostingId: number = 1;

      const mockJobPosting = {
        id: testJobPostingId,
        company: {
          id: 1,
          name: '원티드',
          country: '한국',
          region: '서울',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Company,
        jobPosition: '개발자',
        description: '성실한 개발자를 찾습니다!',
        reward: 10000,
        skill: 'node.js',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as JobPosting;

      const findWithCompanyByIdSpy = jest
        .spyOn(jobPostingRepository, 'findWithCompanyById')
        .mockResolvedValue(mockJobPosting);

      // when
      const result = await jobPostingService.getOne(testJobPostingId);

      // then
      expect(findWithCompanyByIdSpy).toHaveBeenCalledTimes(1);
      expect(findWithCompanyByIdSpy).toHaveBeenCalledWith(testJobPostingId);

      expect(result).toEqual(mockJobPosting);

      // 다음 테스트에 영향을 주지 않기 위해 spy 모킹 해제
      findWithCompanyByIdSpy.mockRestore();
    });

    test('getOne() : JobPosting이 없으면 에러가 발생한다.', async () => {
      // given
      const testJobPostingId: number = 1; // 존재하지 않는 id라고 가정

      const mockJobPosting = null;

      const findWithCompanyByIdSpy = jest
        .spyOn(jobPostingRepository, 'findWithCompanyById')
        .mockResolvedValue(mockJobPosting);

      try {
        // when
        await jobPostingService.getOne(testJobPostingId);
      } catch (error) {
        // then
        // 1. NotFoundException이 발생하는지 확인
        expect(error).toBeInstanceOf(NotFoundException);
        // 2. 에러 메시지를 확인
        expect(error.message).toBeDefined();

        expect(findWithCompanyByIdSpy).toHaveBeenCalledTimes(1);
        expect(findWithCompanyByIdSpy).toHaveBeenCalledWith(testJobPostingId);
      }
    });
  });

  test('getAllOfCompany() : companyId에 해당하는 JobPosting 객체를 반환한다.', async () => {
    // given
    const testCompanyId: number = 1;

    const mockJobPostings = [{ id: 1 }, { id: 2 }, { id: 3 }] as JobPosting[];

    const findByCompanyIdSpy = jest
      .spyOn(jobPostingRepository, 'findByCompanyId')
      .mockResolvedValue(mockJobPostings);

    // when
    const result = await jobPostingService.getAllOfCompany(testCompanyId);

    // then
    expect(findByCompanyIdSpy).toHaveBeenCalledTimes(1);
    expect(findByCompanyIdSpy).toHaveBeenCalledWith(testCompanyId);
    expect(result).toEqual(mockJobPostings);
  });
});
