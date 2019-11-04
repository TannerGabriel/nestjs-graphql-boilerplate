import { Resolver, Mutation, Args, Parent } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../types/user';
import { UserService } from '../user/user.service';
import { Payload } from '../types/payload';
import { UpdateUserDTO } from '../user/dto/update-user.dto';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation()
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user: User = { email, password };
    const response: User = await this.userService.create(user);
    const payload: Payload = {
      email: response.email,
    };

    const token = await this.authService.signPayload(payload);
    return { email: response.email, token };
  }

  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const user: User = { email, password };
    const response: User = await this.userService.findByLogin(user);
    const payload: Payload = {
      email: response.email,
    };

    const token = await this.authService.signPayload(payload);
    return { email: response.email, token };
  }

  @Mutation()
  async update(@Args('id') id: string, @Args('user') user: UpdateUserDTO) {
    return await this.userService.update(id, user);
  }

  // TODO: Add security for delete
  @Mutation()
  async delete(@Args('email') email: string) {
    return await this.userService.deleteUserByEmail(email);
  }
}
