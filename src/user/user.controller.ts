import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto as any);
  }

  @Get()
  findAll(@Query("pageNumber") page: number, @Query("pageSize") size: number) {
    page = page ?? 1;
    size = size ?? 10;
    if (size > 10) {
      size = 10;
    }
    return this.userService.findAll(page, size);
  }
  @Get("count")
  async getUserCount(){
    const count = await this.userService.getCount();
    return {numberOfUsers: count}
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
