import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserService, UserResolver],
  exports: [
    UserService,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
})
export class UserModule {}
