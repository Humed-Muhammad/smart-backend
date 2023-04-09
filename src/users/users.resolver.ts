import { UseGuards } from '@nestjs/common';
import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { User } from 'src/@generated/user/user.model';
import { GqlAuthGuards } from 'src/auth/guards/gql.auth.guard';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private userService: UsersService) {}
  @Query()
  @UseGuards(GqlAuthGuards)
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Query()
  @UseGuards(GqlAuthGuards)
  async getOneUser(@Args('id') id: string): Promise<User> {
    return this.userService.getOneUser(id);
  }

  @Query()
  async getUserByEmail(@Args('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Mutation()
  async register(@Args('data') data: UserCreateInput) {
    try {
      const newUser = await this.userService.register(data);
      if (newUser) {
        return newUser;
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new Error(
            'User already exists with this email or phone number change something and try again!',
          );
        }
      }
    }
  }
}
