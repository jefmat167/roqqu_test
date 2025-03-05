import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressRepository } from './entities/address.repository';
import { UserRepository } from 'src/user/entities/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([AddressEntity]),
  ],
  controllers: [AddressController],
  providers: [AddressService, AddressRepository],
})
export class AddressModule {}
