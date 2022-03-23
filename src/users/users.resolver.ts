import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { User } from 'src/@generated/user/user.model';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private userService: UsersService) {}
  @Query()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Query()
  async getOneUser(@Args('id') id: string): Promise<User> {
    return this.userService.getOneUser(id);
  }

  @Query()
  async getUserByEmail(@Args('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Mutation()
  async register(@Args('data') data: UserCreateInput) {
    return this.userService.register(data);
  }
}
