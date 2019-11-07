import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { GraphqlAuthGuard } from '../guards/gql-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../types/user';
import { UserType } from '../models/user.type';

@UseGuards(GraphqlAuthGuard)
@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(returns => [UserType])
  async users() {
    return await this.userService.showAll();
  }

  @Query(returns => UserType)
  async user(@Args('email') email: string) {
    return await this.userService.getUser(email);
  }

  // TODO: Implement who am i

  @Mutation(returns => UserType)
  async delete(@Args('email') email: string, @CurrentUser() user: User) {
    if (email === user.email) {
      return await this.userService.deleteUserByEmail(email);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Mutation(returns => UserType)
  async update(
    @Args('id') id: string,
    @Args('user') user: UpdateUserInput,
    @CurrentUser() currentUser: User,
  ) {
    if (id === currentUser.id) {
      return await this.userService.update(id, user);
    } else {
      throw new UnauthorizedException();
    }
  }
}
