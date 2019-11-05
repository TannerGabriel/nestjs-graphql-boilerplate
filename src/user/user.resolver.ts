import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../guards/gql-auth.guard';

@UseGuards(GraphqlAuthGuard)
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

  @Mutation()
  async delete(@Args('email') email: string) {
    return await this.userService.deleteUserByEmail(email);
  }

  @Mutation()
  async update(@Args('id') id: string, @Args('user') user: UpdateUserDTO) {
    return await this.userService.update(id, user);
  }
}
