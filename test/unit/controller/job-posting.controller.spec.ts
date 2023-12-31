import { Test, TestingModule } from '@nestjs/testing';

import { RequestWithUser } from '../../../src/common/interface/request.interface';

import { Company } from '../../../src/entity/company.entity';
import { JobPosting } from '../../../src/entity/job-posting.entity';

import { UserService } from '../../../src/api/user/user.service';

import { JobPostingController } from '../../../src/api/job-posting/job-posting.controller';
import { JobPostingService } from '../../../src/api/job-posting/job-posting.service';
import { PostJobPostingDto } from '../../../src/api/job-posting/controller-dto/post-job-posting.dto';
import { UpdateResultDto } from '../../../src/api/job-posting/service-dto/update-result.dto';
import { PatchJobPostingDto } from '../../../src/api/job-posting/controller-dto/patch-job-posting.dto';
import { DeleteResultDto } from '../../../src/api/job-posting/service-dto/delete-result.dto';

describe('JobPostingController', () => {
  let jobPostingController: JobPostingController;
  let jobPostingService: JobPostingService;

  const mockJobPostingService = {
    register: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAll: jest.fn(),
    getOne: jest.fn(),
    getAllOfCompany: jest.fn(),
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
    // 1. 테스트 채용공고 id
    const testJobPostingId: number = 1;
    // 2. 테스트 Request 객체
    const testRequest = {
      user: { id: 1, company: Promise.resolve({ id: 1 }) },
    } as RequestWithUser;

    // 3. 테스트 요청 DTO 객체
    const testPostJobPostingDto = {
      jobPosition: '백엔드 개발자',
      description: '채용 서비스를 개발합니다!',
      reward: 1000000,
      skill: 'nodejs',
    } as PostJobPostingDto;

    // 4. Service 레이어 Mocking
    const registerSpy = jest
      .spyOn(jobPostingService, 'register')
      .mockResolvedValue({
        id: testJobPostingId,
        companyId: 1,
        jobPosition: '백엔드 개발자',
        description: '채용 서비스를 개발합니다!',
        reward: 1000000,
        skill: 'nodejs',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as JobPosting);

    // when
    const response = await jobPostingController.registerJobPosting(
      testRequest,
      testPostJobPostingDto,
    );

    // then
    expect(registerSpy).toHaveBeenCalled();
    expect(response.message).toBeDefined();
    expect(response.jobPosting.id).toBe(testJobPostingId);
  });

  test('updateJobPosting() : 수정된 채용공고 id를 반환한다.', async () => {
    // given
    // 1. 테스트 JobPosting Id
    const testJobPostingId: string = '1';

    // 2. 테스트 Request 객체
    const testRequest = {
      user: { id: 1 },
    } as RequestWithUser;

    // 3. 테스트 요청 DTO 객체
    const testPatchJobPostingDto = {
      jobPosition: '수정할 채용 포지션',
      description: '수정할 채용 내용',
      reward: 10000,
      skill: '수정할 사용 기술',
    } as PatchJobPostingDto;

    // 4. Service 레이어 Mocking
    const updateSpy = jest
      .spyOn(jobPostingService, 'update')
      .mockResolvedValue({
        affected: 1,
      } as UpdateResultDto);

    // when
    const response = await jobPostingController.updateJobPosting(
      testRequest,
      testJobPostingId,
      testPatchJobPostingDto,
    );

    // then
    expect(updateSpy).toHaveBeenCalled();
    expect(response.message).toBeDefined();
    expect(response.jobPosting.id).toBe(testJobPostingId);
  });

  test('removeJobPosting() : 삭제 후 아무 값도 반환하지 않는다.', async () => {
    // given
    // 1. 테스트 채용공고 Id
    const testJobPostingId: string = '1';

    // 2. 테스트 Request 객체
    const testRequest = {
      user: { id: 1 },
    } as RequestWithUser;

    // 3. Service 레이어 Mocking(Mock 데이터로 필요한 값을 반환한다고 가정함)
    const removeSpy = jest
      .spyOn(jobPostingService, 'remove')
      .mockResolvedValue({
        affected: 1,
      } as DeleteResultDto);

    // when
    const response = await jobPostingController.removeJobPosting(
      testRequest,
      testJobPostingId,
    );

    // then
    expect(removeSpy).toHaveBeenCalled();
    expect(response).toBeUndefined();
  });

  describe('getAllJobPostings()', () => {
    test('getAllJobPostings() : 채용 공고 리스트를 반환한다. - 검색 X', async () => {
      // given
      // Service 레이어 Mocking(Mock 데이터로 필요한 값을 반환한다고 가정함)
      const getAllSpy = jest
        .spyOn(jobPostingService, 'getAll')
        .mockResolvedValue([
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
        ] as JobPosting[]);

      // when
      const response = await jobPostingController.getAllJobPostings();

      // then
      expect(getAllSpy).toHaveBeenCalled();
      expect(response.message).toBeDefined();
      // 프로퍼티 key와 value 타입 검증
      response.jobPostings.forEach((jp) => {
        expect(jp).toMatchObject({
          id: expect.any(Number),
          companyName: expect.any(String),
          companyCountry: expect.any(String),
          companyRegion: expect.any(String),
          jobPosition: expect.any(String),
          reward: expect.any(Number),
          skill: expect.any(String),
        });
      });
    });

    test('채용 공고 리스트를 반환한다. - 검색 O', async () => {
      // given
      // 1. 테스트 검색 내용
      const testSearch = '원';
      // 2. Service 레이어 Mocking(Mock 데이터로 필요한 값을 반환한다고 가정함)
      const getAllSpy = jest
        .spyOn(jobPostingService, 'getAll')
        .mockResolvedValue([
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
        ] as JobPosting[]);

      // when
      const response = await jobPostingController.getAllJobPostings(testSearch);

      // then
      expect(getAllSpy).toHaveBeenCalled();
      expect(response.message).toBeDefined();
      // 프로퍼티 key와 value 타입 검증
      response.jobPostings.forEach((jp) => {
        expect(jp).toMatchObject({
          id: expect.any(Number),
          // 검색 내용이 들어가 있는지 검증
          companyName: expect.stringContaining(testSearch),
          companyCountry: expect.any(String),
          companyRegion: expect.any(String),
          jobPosition: expect.any(String),
          reward: expect.any(Number),
          skill: expect.any(String),
        });
      });
    });
  });

  test('getDetailJobPosting() : 채용공고 상세 내용을 반환한다.', async () => {
    // given
    // 1. 테스트 채용공고 Id
    const testJobPostingId: string = '1';
    const testOtherJobPostingId1: number = 2;
    const testOtherJobPostingId2: number = 3;

    // 2. Service 레이어 Mocking(Mock 데이터로 필요한 값을 반환한다고 가정함)
    const getOneSpy = jest
      .spyOn(jobPostingService, 'getOne')
      .mockResolvedValue({
        id: +testJobPostingId,
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
      } as JobPosting);

    const getAllOfCompanySpy = jest
      .spyOn(jobPostingService, 'getAllOfCompany')
      .mockResolvedValue([
        { id: testOtherJobPostingId1 },
        { id: testOtherJobPostingId2 },
      ] as JobPosting[]);

    // when
    const response =
      await jobPostingController.getDetailJobPosting(testJobPostingId);

    // then
    // 1. Service 호출 여부 검증
    expect(getOneSpy).toHaveBeenCalled();
    expect(getAllOfCompanySpy).toHaveBeenCalled();
    // 2. 반환값 확인
    expect(response.message).toBeDefined();
    // 프로퍼티 key와 value 타입 검증
    expect(response.jobPosting).toMatchObject({
      id: expect.any(Number),
      company: {
        id: expect.any(Number),
        name: expect.any(String),
        country: expect.any(String),
        region: expect.any(String),
      },
      jobPosition: expect.any(String),
      description: expect.any(String),
      reward: expect.any(Number),
      skill: expect.any(String),
    });
    // 다른 채용공고의 갯수와 테스트 데이터 포함 여부 검증
    expect(response.otherJobPostings).toHaveLength(2);
    expect(response.otherJobPostings).toEqual(
      expect.arrayContaining([testOtherJobPostingId1, testOtherJobPostingId2]),
    );
    // 상세 조회한 채용공고 id는 포함하지 않았는지 검증
    expect(response.otherJobPostings).toEqual(
      expect.not.arrayContaining([testJobPostingId]),
    );
  });
});
