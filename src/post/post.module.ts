import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UserModule } from 'src/user/user.module';
import { PostRepository } from './entities/post.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    UserModule
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
