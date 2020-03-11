import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { UseGuards, UnauthorizedException, SetMetadata } from '@nestjs/common';
import { GraphqlAuthGuard } from '../guards/gql-auth.guard';
import { CurrentUser } from '../decorators/user.decorator';
import { User } from '../types/user';
import { UserType } from '../models/user.type';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRoles } from '../shared/user-roles';

@UseGuards(GraphqlAuthGuard)
@UseGuards(RolesGuard)
@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  // @Roles("Admin")
  @Query(returns => [UserType])
  async users() {
    return await this.userService.showAll();
  }

  @Query(returns => UserType)
  async user(@Args('email') email: string) {
    return await this.userService.getUser(email);
  }

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
    if (id === currentUser.id || currentUser.userRole === UserRoles.ADMIN) {
      return await this.userService.update(id, user, currentUser.userRole);
    } else {
      throw new UnauthorizedException();
    }
  }
}
