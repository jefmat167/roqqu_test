import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  @Get()
  findAll(@Query("pageNumber") page: number, @Query("pageSize") size: number) {
    page = page ?? 1;
    size = size ?? 10;
    if (size > 10) {
      size = 10;
    }
    return this.addressService.findAll(page, size);
  }

  @Get("\:userId")
  findUserAddress(@Param("userId") userId: string) {
    return this.addressService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch('\:userId')
  update(@Param('userId') userId: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(userId, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
