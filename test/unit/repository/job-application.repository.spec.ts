import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, ILike } from 'typeorm';

import { JobPostingRepository } from '../../../src/repository/job-posting.repository';
import { JobPosting } from '../../../src/entity/job-posting.entity';
import { Company } from '../../../src/entity/company.entity';

describe('JobPostingRepository', () => {
  let jobPostingRepository: JobPostingRepository;

  const MockDataSource = {
    createEntityManager: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobPostingRepository,
        {
          provide: DataSource,
          useValue: MockDataSource,
        },
      ],
    }).compile();

    jobPostingRepository =
      module.get<JobPostingRepository>(JobPostingRepository);
  });

  it('should be defined', async () => {
    expect(jobPostingRepository).toBeDefined();
  });

  test('findWithCompany() : Company를 포함한 JobPosting 객체 배열을 반환한다.', async () => {
    // given
    const mockJobPostingWithCompany = [
      {
        id: 1,
        company: {
          id: 1,
          name: '원티드',
          country: '한국',
          region: '서울',
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
        } as Company,
        jobPosition: '디자이너',
        description: '성실한 디자이너를 찾습니다!',
        reward: 20000,
        skill: 'photoshop',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as JobPosting[];

    const findSpy = jest
      .spyOn(jobPostingRepository, 'find')
      .mockResolvedValue(mockJobPostingWithCompany);

    // when
    const found = await jobPostingRepository.findWithCompany();

    // then
    expect(findSpy).toHaveBeenCalledWith({ relations: { company: true } });
    expect(found).toEqual(mockJobPostingWithCompany);
  });

  test('findWithCompanyBySearch() : 검색 내용과 일치하는 (company를 포함)JobPosting 객체 배열을 반환한다.', async () => {
    // given
    const testSearch: string = '원';

    const mockJobPostings = [
      {
        id: 1,
        company: {
          id: 1,
          name: '원티드',
          country: '한국',
          region: '서울',
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
        } as Company,
        jobPosition: '디자이너',
        description: '성실한 디자이너를 찾습니다!',
        reward: 10000,
        skill: 'photoshop',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ] as JobPosting[];

    const findSpy = jest
      .spyOn(jobPostingRepository, 'find')
      .mockResolvedValue(mockJobPostings);

    // when
    const found =
      await jobPostingRepository.findWithCompanyBySearch(testSearch);

    // then
    expect(findSpy).toHaveBeenCalledWith({
      relations: { company: true },
      where: [
        { company: { name: ILike(`%${testSearch}%`) } },
        { skill: ILike(`%${testSearch}%`) },
      ],
    });
    expect(found).toEqual(mockJobPostings);
  });

  test('findWithCompanyById() : id가 일치하는 (company 포함)JobPosting 객체를 반환한다.', async () => {
    // given
    const testJobPostingId: number = 1;

    const mockJobPosting = {
      id: 1,
      company: {
        id: 1,
        name: '원티드',
        country: '한국',
        region: '서울',
      } as Company,
      jobPosition: '개발자',
      description: '성실한 개발자를 찾습니다!',
      reward: 10000,
      skill: 'node.js',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as JobPosting;

    const findSpy = jest
      .spyOn(jobPostingRepository, 'findOne')
      .mockResolvedValue(mockJobPosting);

    // when
    const found =
      await jobPostingRepository.findWithCompanyById(testJobPostingId);

    // then
    expect(findSpy).toHaveBeenCalledWith({
      relations: { company: true },
      where: { id: testJobPostingId },
    });
    expect(found).toEqual(mockJobPosting);
  });

  test('findByCompanyId() : company.id가 일치하는 JobPosting id 객체를 반환한다.', async () => {
    // given
    // when
    // then
  });
});
