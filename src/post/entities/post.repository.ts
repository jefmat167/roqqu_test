import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from 'src/database/abstract.repository';
import { PostModel } from './post.model';
import { PostEntity } from './post.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class PostRepository implements AbstractRepository<PostModel> {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepo: Repository<PostEntity>,
  ) {}
    async create(data: Omit<PostModel, "createdAt" | "updatedAt" | "id">): Promise<PostModel> {
        const userEntity = new UserEntity({id: data.user.id})
        const entity = new PostEntity({...data, user: userEntity});
        const created = await this.postRepo.save(this.postRepo.create(entity))
        return new PostModel({...created});
    }

    async findAll(pageNumber: number, pageSize: number): Promise<PostModel[] | null> {
        const posts = await this.postRepo.find({
            skip: (pageNumber - 1) * pageSize,
            take: pageSize
        });
        if (!posts) return null;

        return posts.map(post => new PostModel({...post}));
    }

    async findOne(criteria: Partial<PostModel>): Promise<PostModel | null> {
        const post = await this.postRepo.findOne({where: criteria});

        if (!post) return null;

        return new PostModel({...post});
    }

    async findByUserId(userId: string): Promise<PostModel[]> {
        const posts = await this.postRepo.find({
            where: {user: {id: userId}}
        });
        return posts.map(post => new PostModel({...post}));
    }

    async getCount(): Promise<number> {
        return await this.postRepo.count({});
    }

    async findById(id: string): Promise<PostModel | null> {
        const post = await this.postRepo.findOne({
            where: {id},
        });
        if (!post) return null;

        return new PostModel({...post});
    }
    async update(id: string, data: Partial<PostModel>): Promise<PostModel | null> {
        const post = await this.postRepo.findOne({where:{id}});
        if (!post) return null;
        const updated = await this.postRepo.update(id, data);
        return new PostModel({...updated.raw});
    }
    async delete(id: string): Promise<any> {
        (await this.postRepo.delete(id)).raw;
    }

}
