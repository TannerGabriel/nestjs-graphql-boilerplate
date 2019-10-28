import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../types/user';
import { Logger } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  async users() {
    return await this.userService.showAll();
  }

  @Query()
  async user(@Args('email') email: string) {
    return await this.userService.getUser(email);
  }

  // TODO: Implement who am i

  // TODO: Implement login
  //   @Mutation()
  //   async login(
  //     @Args('email') email: string,
  //     @Args('password') password: string,
  //   ) {
  //     const user: User = { email, password };
  //     return await this.userService.login(user);
  //   }
}
