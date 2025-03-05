import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { AbstractRepository } from 'src/database/abstract.repository';
import { UserModel } from './user.model';

@Injectable()
export class UserRepository implements AbstractRepository<UserModel> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}
    async create(data: Omit<UserModel, "createdAt" | "updatedAt" | "address" | "posts" | "id">): Promise<UserModel> {
        const entity = new UserEntity({...data});
        const created = await this.userRepo.save(this.userRepo.create(entity))
        return new UserModel({...created});
    }

    async findAll(pageNumber: number, pageSize: number): Promise<UserModel[] | null> {
        const users = await this.userRepo.find({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            relations: ["address"]
        });
        if (!users) {
            return null;
        }
        return users.map(u => new UserModel({...u}));
    }

    async findOne(criteria: Partial<UserModel>): Promise<UserModel | null> {
        const user = await this.userRepo.findOne({where: criteria});
        if (!user) {
            return null;
        }
        return new UserModel({...user});
    }

    async getCount(): Promise<number> {
        return await this.userRepo.count({});
    }

    async findById(id: string): Promise<UserModel | null> {
        const user = await this.userRepo.findOne({
            where: {id},
            relations: ["address"]
        });
        if (!user) {
            return null;
        }
        return new UserModel({...user});
    }
    async update(id: string, data: Partial<UserModel>): Promise<UserModel | null> {
        const user = await this.userRepo.findOne({where:{id}});
        if (!user) {
            return null;
        }
        const updated = await this.userRepo.update(id, data);
        return new UserModel({...updated.raw});
    }
    async delete(id: string | number): Promise<void> {
        await this.userRepo.delete(id);
    }

}
