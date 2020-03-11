import {
  Injectable,
  HttpException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../types/user';
import { CreateUserInput } from './dto/user.input';
import * as bcrypt from 'bcrypt';
import { UpdateUserInput } from './dto/update-user.input';
import { UserType } from '../models/user.type';
import { UserRoles } from '../shared/user-roles';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserType>,
  ) {}

  async showAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async getUser(email: string): Promise<UserType> {
    return await this.userModel.findOne({
      email,
    });
  }

  async create(userDTO: User): Promise<UserType> {
    const { email } = userDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(userDTO);
    return await createdUser.save();
  }

  async findByLogin(userDTO: CreateUserInput) {
    const { email, password } = userDTO;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (await bcrypt.compare(password, user.password)) {
      return user;
    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async update(id: string, newUser: UpdateUserInput, role: UserRoles) {
    const user: User = await this.userModel.findOne({ _id: id });
    const userWithEmail = await this.userModel.findOne({
      email: newUser.email,
    });

    if (user === undefined || user === null) {
      throw new HttpException(`User doesn't exists`, HttpStatus.BAD_REQUEST);
    } else if (
      userWithEmail !== null &&
      userWithEmail !== undefined &&
      newUser.email !== user.email
    ) {
      throw new HttpException('Email is already used', HttpStatus.BAD_REQUEST);
    }

    if (
      role == UserRoles.NORMAL &&
      newUser.userRole != user.userRole &&
      newUser.userRole != null &&
      newUser.userRole != undefined
    ) {
      throw new ForbiddenException("Normal users can't change roles");
    }

    let userRole: UserRoles;
    if (role === UserRoles.ADMIN) userRole = newUser.userRole;
    else if (role === undefined || role === null) user.userRole;
    else userRole = user.userRole;

    const updateUser: CreateUserInput = {
      email: newUser.email || user.email,
      password: newUser.password || user.password,
      userRole: userRole,
    };

    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      {
        ...updateUser,
      },
      {
        new: true,
      },
    );

    return updatedUser;
  }

  async findByPayload(payload: any) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async deleteUserById(id: string) {
    const user = await this.userModel.findOne({ _id: id });

    if (user === undefined || user === null) {
      throw new HttpException(`User doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    return await this.userModel.findByIdAndRemove(id);
  }

  async deleteUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (user === undefined || user === null) {
      throw new HttpException(`User doesn't exists`, HttpStatus.BAD_REQUEST);
    }

    return await this.userModel.findOneAndDelete({ email });
  }
}
