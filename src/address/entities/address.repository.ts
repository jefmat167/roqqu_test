import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from 'src/database/abstract.repository';
import { AddressModel } from './address.model';
import { AddressEntity } from './address.entity';
import { UserModel } from "../../user/entities/user.model";
import { UserEntity } from "../../user/entities/user.entity";

@Injectable()
export class AddressRepository implements AbstractRepository<AddressModel> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepo: Repository<AddressEntity>
  ) {}
    async create(data: Omit<AddressModel, "createdAt" | "updatedAt" | "id">): Promise<AddressModel> {
        const userEntity = new UserEntity({...data.user});
        const addressEntity = new AddressEntity({...data, user: userEntity});
        const created = await this.addressRepo.save(this.addressRepo.create(addressEntity))
        const userModel = new UserModel({id: created.user.id});
        return new AddressModel({...created, user: userModel});
    }

    async findAll(pageNumber: number, pageSize: number): Promise<AddressModel[] | null> {
        const addresses = await this.addressRepo.find({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize
        });
        if (!addresses) {
            return null;
        }
        return addresses.map(address => new AddressModel({...address}));
    }

    async findOne(criteria: Partial<AddressModel>): Promise<AddressModel | null> {
        const user = await this.addressRepo.findOne({where: criteria});
        if (!user) {
            return null;
        }
        return new AddressModel({...user});
    }

    async getCount(): Promise<number> {
        return await this.addressRepo.count({});
    }

    async findById(id: string): Promise<AddressModel | null> {
        const address = await this.addressRepo.findOne({where: {id}});
        if (!address) {
            return null;
        }
        return new AddressModel({...address});
    }

    async findByUserId(userId: string): Promise<AddressModel | null> {
        const address = await this.addressRepo.find({
            where: {user: {id: userId}}
        });
        if (address.length < 1) return null;

        const addressEntity = address.map(ad => new AddressModel({...ad}));
        return addressEntity[0];
    }
    async update(userId: string, data: Partial<AddressModel>): Promise<AddressModel | null> {
        const address = await this.addressRepo.findOne({
            where: {user: {id: userId}}
        });
        if (!address) return null;

        return await this.addressRepo.save(this.addressRepo.create({
            ...address,
            ...data
        }));
    }
    async delete(id: string): Promise<void> {
        await this.addressRepo.delete(id);
    }

}
