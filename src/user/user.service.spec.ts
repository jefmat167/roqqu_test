import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './entities/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import { UserModel } from './entities/user.model';

describe('UserService tests', () => {
  let userService: UserService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    getCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('create a user', () => {
    it('should throw BadRequestException with correct message if email already in use', async () => {
      const createUserDto: CreateUserDto = { email: 'mail@example.com' } as CreateUserDto;
      mockUserRepository.findOne.mockResolvedValue(new UserModel({ id: 'uuid', email: 'mail@example.com' }));

      try {
        await userService.create(createUserDto);
        expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual("Provided email already in use");
      }
    });

    it('should create a new user if email is not in use', async () => {
      const createUserDto: CreateUserDto = { email: 'mail@example.com' } as CreateUserDto;
      mockUserRepository.findOne.mockResolvedValue(null);
      const createdUser = new UserModel({ id: 'uuid', email: 'mail@example.com'});
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userService.create(createUserDto);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(createdUser);
      expect(result).toBeInstanceOf(UserModel);
    });
  });

  describe('find all users', () => {
    it('should return an array of users', () => {
      const users = [
        new UserModel({ id: 'uuid1', email: 'mail@example1.com' }),
        new UserModel({ id: 'uuid2', email: 'mail@example2.com' }),
        new UserModel({ id: 'uuid3', email: 'mail@example3.com' }),
      ];

      mockUserRepository.findAll.mockReturnValue(users);

      const result = userService.findAll(1, 10);

      expect(mockUserRepository.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(users);
      expect(result[1]).toBeInstanceOf(UserModel);
    });
  });

  describe('find one user', () => {
    it('should return a user by id', () => {
      const user = new UserModel({ id: 'uuid', email: 'mail@example.com' });
      mockUserRepository.findById.mockReturnValue(user);

      const result = userService.findOne('uuid');
      expect(mockUserRepository.findById).toHaveBeenCalledWith('uuid');
      expect(result).toEqual(user);
      expect(result).toBeInstanceOf(UserModel);
    });
  });

  describe('users count', () => {
    it('should return the total number of users', async () => {
      const users = [
        new UserModel({ id: 'uuid1', email: 'mail@example1.com' }),
        new UserModel({ id: 'uuid2', email: 'mail@example2.com' }),
        new UserModel({ id: 'uuid3', email: 'mail@example3.com' }),
        new UserModel({ id: 'uuid4', email: 'mail@example4.com' }),
        new UserModel({ id: 'uuid5', email: 'mail@example5.com' }),
      ];
      mockUserRepository.getCount.mockResolvedValue(users.length);
      const result = await userService.getCount();
      expect(mockUserRepository.getCount).toHaveBeenCalled();
      expect(result).toEqual(users.length);
    });
  });

});
