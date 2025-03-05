import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';
import { AddressRepository } from './entities/address.repository';
import { UserRepository } from "../user/entities/user.repository";;
import { BadRequestException } from '@nestjs/common';
import { UserModel } from "../user/entities/user.model";
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressModel } from './entities/address.model';
import { UpdateAddressDto } from './dto/update-address.dto';

describe('AddressService', () => {
  let addressRepo: jest.Mocked<AddressRepository>;
  let userRepo: jest.Mocked<UserRepository>;
  let service: AddressService;

  const mockAddressRepository = {
    findByUserId: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: AddressRepository, useValue: mockAddressRepository },
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepo = module.get(AddressRepository);
    userRepo = module.get(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  describe('create an address for a user', () => {
    const createAddressDto: CreateAddressDto = {
      userId: 'user-uuid',
      street: '123 Ogere Street',
      city: 'Bariga',
      state: 'Lagos State',
      country: 'Nigeria'
    };

    it('should throw BadRequestException if user not found', async () => {
      userRepo.findById.mockResolvedValue(null);
      try {
        await service.create(createAddressDto);
        expect(userRepo.findById).toHaveBeenCalledWith(createAddressDto.userId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual("User with provided ID not found");
      }
    });

    it('should throw BadRequestException if an address already exists for the user', async () => {
      userRepo.findById.mockResolvedValue(new UserModel({ id: 'user-uuid' }));
      addressRepo.findByUserId.mockResolvedValue(new AddressModel({ ...createAddressDto }));

      try {
        await service.create(createAddressDto);
        expect(addressRepo.findByUserId).toHaveBeenCalledWith(createAddressDto.userId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual("This user already has an associated address");
      }
    });

    it('should create a new address if user exists and no associated address', async () => {
      userRepo.findById.mockResolvedValue(new UserModel({ id: 'user-1' }));
      addressRepo.findByUserId.mockResolvedValue(null);

      const createdAddress = new AddressModel({ ...createAddressDto });
      addressRepo.create.mockResolvedValue(createdAddress);

      const result = await service.create(createAddressDto);

      expect(userRepo.findById).toHaveBeenCalledWith(createAddressDto.userId);
      expect(addressRepo.findByUserId).toHaveBeenCalledWith(createAddressDto.userId);
      expect(addressRepo.create).toHaveBeenCalled();
      expect(result).toEqual(createdAddress);
      expect(result).toBeInstanceOf(AddressModel);
    });
  });

  describe("update user's address", () => {
    const updateAddressDto: UpdateAddressDto = {
      street: 'Jakande',
      city: 'Lekki'
    };

    it('should throw BadRequestException if user not found', async () => {
      userRepo.findById.mockResolvedValue(null);
      const userId = 'user-uuid';

      try {
        await service.update(userId, updateAddressDto);
        expect(userRepo.findById).toHaveBeenCalledWith(userId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual("User with provided Id not found");
      }
    });

    it('should throw BadRequestException if no address is associated with the user', async () => {
      const userId = 'user-1';
      userRepo.findById.mockResolvedValue(new UserModel({ id: userId }));
      addressRepo.update.mockResolvedValue(null);

      await expect(service.update(userId, updateAddressDto))
        .rejects
        .toThrow(BadRequestException);
      expect(addressRepo.update).toHaveBeenCalledWith(userId, updateAddressDto);
    });

    it('should update and return the updated address', async () => {
      const userId = 'user-1';
      userRepo.findById.mockResolvedValue(new UserModel({ id: userId }));
      const updatedAddress = new AddressModel({ user: new UserModel({ id: userId }), ...updateAddressDto });
      addressRepo.update.mockResolvedValue(updatedAddress);

      const result = await service.update(userId, updateAddressDto);

      expect(userRepo.findById).toHaveBeenCalledWith(userId);
      expect(addressRepo.update).toHaveBeenCalledWith(userId, updateAddressDto);
      expect(result).toEqual(updatedAddress);
    });
  });
});
