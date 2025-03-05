import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { UserRepository } from '../user/entities/user.repository';
import { PostRepository } from './entities/post.repository';
import { BadRequestException } from '@nestjs/common';
import { UserModel } from '../user/entities/user.model';
import { CreatePostDto } from './dto/create-post.dto';
import { PostModel } from './entities/post.model';

describe('PostService', () => {
  let service: PostService;
  let postRepo: jest.Mocked<PostRepository>;
  let userRepo: jest.Mocked<UserRepository>;

  const mockUserRepository = {
    findById: jest.fn(),
  }

  const mockPostRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PostRepository,
          useValue: mockPostRepository
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    userRepo = module.get(UserRepository);
    postRepo = module.get(PostRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  describe('create a post', () => {
    it('should create a post when the user exists', async () => {
      const createPostDto: CreatePostDto = { userId: 'uuid', title: 'title', body: 'body' };
      userRepo.findById.mockResolvedValue(new UserModel({ id: 'uuid' }));
      
      const createdPost = new PostModel({ id: 'uuid', ...createPostDto });
      postRepo.create.mockResolvedValue(createdPost);

      const result = await service.create(createPostDto);
      
      expect(userRepo.findById).toHaveBeenCalledWith(createPostDto.userId);
      expect(postRepo.create).toHaveBeenCalledWith({
        ...createPostDto,
        user: new UserModel({ id: createPostDto.userId }),
      });
      expect(result).toEqual(createdPost);
      expect(result).toBeInstanceOf(PostModel)
    });

    it('should throw a BadRequestException if the user does not exist', async () => {
      const createPostDto = { userId: 'uuid', title: 'title', body: 'content' };
      userRepo.findById.mockResolvedValue(null);

      try {
        await service.create(createPostDto);
        expect(userRepo.findById).toHaveBeenCalledWith(createPostDto.userId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual("User with provided ID not found")
      }

      await expect(service.create(createPostDto)).rejects.toThrow(BadRequestException);
    });
  });

});
