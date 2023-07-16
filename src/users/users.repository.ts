import { Types, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { RolesEnum } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from '../features/users/dto/update-user.dto';
import SignUpDto from 'src/authorization/auth/dto/sign-up.dto';

@Injectable()
export default class UsersRepository {
  constructor(@InjectModel(User.name) private usersModel: Model<IUser>) {}

  public async create(user: SignUpDto): Promise<IUser> {
    const newUser = await this.usersModel.create({
      ...user,
      verified: false,
    });

    return newUser;
  }

  public async getUnverifiedUserByEmail(email: string): Promise<IUser | null> {
    return this.usersModel
      .findOne({
        email,
        verified: false,
      })
      .exec();
  }

  public async getVerifiedUserByEmail(email: string): Promise<IUser | null> {
    return this.usersModel
      .findOne({
        email,
        verified: true,
      })
      .exec();
  }

  public async getById(id: Types.ObjectId): Promise<IUser | null> {
    return this.usersModel
      .findOne(
        {
          _id: id,
        },
        { password: 0 },
      )
      .exec();
  }

  public async getVerifiedUserById(id: Types.ObjectId): Promise<IUser | null> {
    return this.usersModel
      .findOne(
        {
          _id: id,
          verified: true,
        },
        { password: 0 },
      )
      .exec();
  }

  public async getUnverifiedUserById(
    id: Types.ObjectId,
  ): Promise<IUser | null> {
    return this.usersModel
      .findOne(
        {
          _id: id,
          verified: false,
        },
        { password: 0 },
      )
      .exec();
  }

  public async updateById(
    id: Types.ObjectId,
    data: UpdateUserDto,
  ): Promise<IUser | null> {
    return this.usersModel
      .findByIdAndUpdate(id, {
        $set: data,
      })
      .exec();
  }

  public getAll() {
    return this.usersModel.find().exec();
  }

  public getVerifiedUsers() {
    return this.usersModel.find({ verified: true }).exec();
  }

  public async getVerifiedAdminByEmail(email: string): Promise<IUser | null> {
    return this.usersModel
      .findOne({
        email,
        roles: { $in: RolesEnum.ADMIN },
        verified: true,
      })
      .exec();
  }
}
