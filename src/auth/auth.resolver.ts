import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../types/user';
import { UserService } from '../user/user.service';
import { Payload } from '../types/payload';
import { AuthType } from '../models/auth.type';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Mutation(returns => AuthType)
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

  @Mutation(returns => AuthType)
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
}
