import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostRepository } from './entities/post.repository';
import { UserRepository } from '../user/entities/user.repository';
import { UserModel } from '../user/entities/user.model';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepo: PostRepository, 
    private readonly userRepo: UserRepository
  ){}
  async create(createPostDto: CreatePostDto) {
    const user = await this.userRepo.findById(createPostDto.userId);
    if (!user) {
      throw new BadRequestException("User with provided ID not found");
    }
    return await this.postRepo.create({...createPostDto, user: new UserModel({id: createPostDto.userId})});
  }

  async findByUserId(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new BadRequestException("User with provided ID not found");
    }
    return await this.postRepo.findByUserId(userId);
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: string) {
    return `This action returns a #${id} post`;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: string) {
    return this.postRepo.delete(id);;
  }
}
