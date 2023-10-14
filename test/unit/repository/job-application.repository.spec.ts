import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { JobApplicationRepository } from '../../../src/repository/job-application.repository';
import {
  JobApplication,
  JobApplicationStatus,
} from '../../../src/entity/job-application.entity';

describe('JobApplicationRepository', () => {
  let jobApplicationRepository: JobApplicationRepository;

  const MockDataSource = {
    createEntityManager: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobApplicationRepository,
        {
          provide: DataSource,
          useValue: MockDataSource,
        },
      ],
    }).compile();

    jobApplicationRepository = module.get<JobApplicationRepository>(
      JobApplicationRepository,
    );
  });

  it('should be defined', async () => {
    expect(jobApplicationRepository).toBeDefined();
  });

  test('findAppliedByJobPostingId() : jobPostingId에 해당하는 status가 APPLIED인 JobApplication 객체 리스트를 반환한다.', async () => {
    // given
    const testJobPostingId = 1;
    const mockJobApplications = [
      {
        id: 2,
        jobPostingId: testJobPostingId,
        applicantId: 3,
        status: JobApplicationStatus.APPLIED,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        jobPostingId: testJobPostingId,
        applicantId: 5,
        status: JobApplicationStatus.APPLIED,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as JobApplication[];

    const findOneBySpy = jest
      .spyOn(jobApplicationRepository, 'find')
      .mockResolvedValue(mockJobApplications);

    // when
    const found =
      await jobApplicationRepository.findAppliedByJobPostingId(
        testJobPostingId,
      );

    // then
    expect(findOneBySpy).toHaveBeenCalledWith({
      where: {
        jobPosting: { id: testJobPostingId },
        status: JobApplicationStatus.APPLIED,
      },
    });
    expect(found).toEqual(mockJobApplications);
  });
});
