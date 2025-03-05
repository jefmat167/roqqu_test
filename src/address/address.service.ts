import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './entities/address.repository';
import { UserRepository } from "../user/entities/user.repository";
import { AddressModel } from './entities/address.model';
import { UserModel } from "../user/entities/user.model";

@Injectable()
export class AddressService {
  constructor(
    private readonly addressRepo: AddressRepository,
    private readonly userRepo: UserRepository
  ){}
  async create(createAddressDto: CreateAddressDto) {
    const user = await this.userRepo.findById(createAddressDto.userId);
    if (!user) {
      throw new BadRequestException("User with provided ID not found");
    }
    const address = await this.addressRepo.findByUserId(createAddressDto.userId);
    if (address) {
      throw new BadRequestException("This user already has an associated address");
    }
    const userModel = new UserModel({id: createAddressDto.userId});
    const addressModel = new AddressModel({...createAddressDto, user: userModel});
    return await this.addressRepo.create(addressModel);
  }

  async findAll(pageNumber: number, pageSize: number) {
    return await this.addressRepo.findAll(pageNumber, pageSize)
  }

  async findByUserId(userId: string) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new BadRequestException("User with provided ID not found");
    }
    return await this.addressRepo.findByUserId(userId);
  }

  async findOne(id: string) {
    return await this.addressRepo.findById(id) ;
  }

  async update(userId: string, updateAddressDto: UpdateAddressDto) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new BadRequestException("User with provided Id not found");
    }
    const updateResult = await this.addressRepo.update(userId, updateAddressDto);
    if (!updateResult) {
      throw new BadRequestException("This user doesn't have an associated address");
    }
    return updateResult;
  }

  async remove(id: string) {
    return await this.addressRepo.delete(id);
  }
}
