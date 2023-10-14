import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { UserService } from '../../../src/api/user/user.service';

import { Role, User } from '../../../src/entity/user.entity';
import { UserRepository } from '../../../src/repository/user.repository';
import { JobPostingRepository } from '../../../src/repository/job-posting.repository';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const mockUserRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JobPostingRepository,
          useClass: Repository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  test('getOne() : 하나의 회원 정보를 반환한다.', async () => {
    // given
    const testUserId = 1;

    const findByIdSpy = jest
      .spyOn(userRepository, 'findById')
      .mockResolvedValue({
        id: testUserId,
        email: 'test@gmail.com',
        password: '1234',
        name: 'test',
        role: Role.INDIVIDUAL,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User);

    // when
    const result = await userService.getOne(testUserId);

    // then
    expect(findByIdSpy).toHaveBeenCalled();
    expect(result).toMatchObject({
      id: testUserId,
      email: expect.any(String),
      password: expect.any(String),
      name: expect.any(String),
      role: expect.anything(),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
