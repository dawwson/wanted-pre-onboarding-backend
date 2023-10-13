import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { Role, User } from '../../../src/entity/user.entity';
import { UserRepository } from '../../../src/repository/user.repository';
import { UserService } from '../../../src/api/user/user.service';

import { getRepositoryToken } from '@nestjs/typeorm';
import { JobPostingRepository } from '../../../src/repository/job-posting.repository';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let jobPostingRepository: JobPostingRepository;

  const mockUserRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserRepository),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(JobPostingRepository),
          useValue: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(
      getRepositoryToken(UserRepository),
    );
    jobPostingRepository = module.get<JobPostingRepository>(
      getRepositoryToken(JobPostingRepository),
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
    expect(jobPostingRepository).toBeDefined();
  });

  test('getOne() : 하나의 회원 정보를 반환한다.', async () => {
    // given
    const testUserId = 1;
    const mockRepoValue = {
      id: testUserId,
      email: 'test@gmail.com',
      password: '1234',
      name: 'test',
      role: Role.INDIVIDUAL,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    jest.spyOn(userRepository, 'findById').mockResolvedValue(mockRepoValue);

    // when
    const user = await userService.getOne(testUserId);

    // then
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('createdAt');
    expect(user).toHaveProperty('updatedAt');
  });
});
