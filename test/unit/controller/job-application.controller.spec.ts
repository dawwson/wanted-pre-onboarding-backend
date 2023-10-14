import { Test, TestingModule } from '@nestjs/testing';
import { JobApplicationController } from '../../../src/api/job-application/job-application.controller';
import { JobApplicationService } from '../../../src/api/job-application/job-application.service';
import { RequestWithUser } from '../../../src/common/interface/request.interface';
import { PostJobApplicationDto } from '../../../src/api/job-application/controller-dto/post-job-application.dto';
import {
  JobApplication,
  JobApplicationStatus,
} from '../../../src/entity/job-application.entity';

describe('JobApplicationController', () => {
  let jobApplicationController: JobApplicationController;
  let jobApplicationService: JobApplicationService;

  const mockJobApplicationService = {
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobApplicationController],
      providers: [
        // 필요한 프로바이더를 모킹한 값으로 넣어준다.
        {
          provide: JobApplicationService,
          useValue: mockJobApplicationService,
        },
      ],
    }).compile();

    jobApplicationController = module.get<JobApplicationController>(
      JobApplicationController,
    );
    jobApplicationService = module.get<JobApplicationService>(
      JobApplicationService,
    );
  });

  it('should be defined', () => {
    expect(jobApplicationController).toBeDefined();
    expect(jobApplicationService).toBeDefined();
  });

  test('registerJobApplication() : 생성된 지원내역 id를 반환한다.', async () => {
    // given
    // 1. 테스트 채용공고 Id
    const testJobPostingId: number = 1;
    const testApplicantId: number = 2;
    const testJobApplicationId: number = 3;

    // 2. 테스트 Request 객체
    const testRequest = {
      user: { id: testApplicantId },
    } as RequestWithUser;

    // 3. 테스트 요청 DTO 객체
    const testDto = {
      jobPostingId: testJobPostingId,
    } as PostJobApplicationDto;

    // 4. Service 레이어 Mocking(Mock 데이터로 필요한 값을 반환한다고 가정함)
    const registerSpy = jest
      .spyOn(jobApplicationService, 'register')
      .mockResolvedValue({
        id: 3,
        applicantId: testApplicantId,
        jobPostingId: testJobPostingId,
        status: JobApplicationStatus.APPLIED,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as JobApplication);

    // when
    const response = await jobApplicationController.registerJobApplication(
      testRequest,
      testDto,
    );
    // then
    expect(registerSpy).toHaveBeenCalled();
    expect(response.message).toBeDefined();
    expect(response.jobApplication.id).toBe(testJobApplicationId);
  });
});
