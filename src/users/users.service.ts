import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from './interfaces/user.interface';
@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    return await this.userModel.create(createUserDto);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: number) {
    try {
      return await this.userModel.findById(id).exec();
    } catch (error) {
      // Handle error here
      throw new HttpException(
        `Error occurred while finding user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<IUser> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      throw new HttpException(
        `Error occurred while updating user: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  public getUnverifiedUserByEmail(email: string): Promise<IUser | null> {
    return this.userModel.getUnverifiedUserByEmail(email);
  }

  public getVerifiedUserByEmail(email: string): Promise<IUser | null> {
    return this.userModel.getVerifiedUserByEmail(email);
  }

  public getById(id: Types.ObjectId): Promise<IUser | null> {
    return this.userModel.getById(id);
  }

  public getVerifiedUserById(id: Types.ObjectId): Promise<IUser | null> {
    return this.userModel.getVerifiedUserById(id);
  }

  public getUnverifiedUserById(id: Types.ObjectId): Promise<IUser | null> {
    return this.userModel.getUnverifiedUserById(id);
  }

  public getVerifiedUsers() {
    return this.userModel.getVerifiedUsers();
  }
}
