import { Test, TestingModule } from '@nestjs/testing';

import { JobApplicationService } from '../../../src/api/job-application/job-application.service';
import {
  JobApplication,
  JobApplicationStatus,
} from '../../../src/entity/job-application.entity';
import { JobApplicationRepository } from '../../../src/repository/job-application.repository';

describe('JobApplicationService', () => {
  let jobApplicationService: JobApplicationService;
  let jobApplicationRepository: JobApplicationRepository;

  const mockJobApplicationRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobApplicationService,
        {
          provide: JobApplicationRepository,
          useValue: mockJobApplicationRepository,
        },
      ],
    }).compile();

    jobApplicationService = module.get<JobApplicationService>(
      JobApplicationService,
    );
    jobApplicationRepository = module.get<JobApplicationRepository>(
      JobApplicationRepository,
    );
  });

  it('should be defined', () => {
    expect(jobApplicationService).toBeDefined();
  });

  test('register() : 생성된 지원내역을 반환한다.', async () => {
    // given
    const testApplicantId: number = 1;
    const testJobPostingId: number = 2;

    const mockJobApplication = {
      id: 3,
      applicantId: testApplicantId,
      jobPostingId: testJobPostingId,
      status: JobApplicationStatus.APPLIED,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as JobApplication;

    const saveSpy = jest
      .spyOn(jobApplicationRepository, 'save')
      .mockResolvedValue(mockJobApplication);

    // when
    const result = await jobApplicationService.register(
      testApplicantId,
      testJobPostingId,
    );

    // then
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject(mockJobApplication);
  });
});
