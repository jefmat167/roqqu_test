import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './entities/user.repository';

@Injectable()
export class UserService {

  constructor(private readonly userRepo: UserRepository){}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepo.findOne({email: createUserDto.email});
    if (user) {
      throw new BadRequestException(`Provided email already in use`);
    }
    return this.userRepo.create(createUserDto);
  }

  findAll(page: number, size: number) {
    return this.userRepo.findAll(page, size);
  }

  async findOne(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException("User with provided ID not found");
    return user;
  }

  async getCount() {
    return await this.userRepo.getCount();
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.userRepo.delete(id);
  }
}
