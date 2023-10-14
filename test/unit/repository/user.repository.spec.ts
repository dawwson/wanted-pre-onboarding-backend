import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { UserRepository } from '../../../src/repository/user.repository';
import { Role, User } from '../../../src/entity/user.entity';

describe('UserRepository', () => {
  let userRepository: UserRepository;

  const MockDataSource = {
    createEntityManager: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: MockDataSource,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', async () => {
    expect(userRepository).toBeDefined();
  });

  test('findById() : User 객체를 반환한다.', async () => {
    // given
    const testId = 1;
    const mockUser = {
      id: testId,
      email: 'test@naver.com',
      password: '1234',
      name: 'test',
      role: Role.INDIVIDUAL,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as User;

    const findOneBySpy = jest
      .spyOn(userRepository, 'findOneBy')
      .mockResolvedValue(mockUser);

    // when
    const found = await userRepository.findById(testId);

    // then
    expect(findOneBySpy).toHaveBeenCalledWith({ id: testId });
    expect(found).toEqual(mockUser);
  });
});
