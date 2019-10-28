import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../types/user';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async showAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async getUser(email: string): Promise<User> {
    return await this.userModel.findOne({
      email,
    });
  }

  async create(userDTO: User): Promise<User> {
    const { email } = userDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(userDTO);
    return await createdUser.save();
  }

  async findByPayload(payload: any) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }
}
