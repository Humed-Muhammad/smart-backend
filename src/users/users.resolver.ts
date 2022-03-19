import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver()
export class UsersResolver {
  constructor(private prisma: PrismaService) {}
  @Query('users')
  async getUsers() {
    return await this.prisma.user.findMany();
  }

  @Query('getUserById')
  async getUser(@Args('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    console.log(user);
    if (user === null) {
      return 'No user found with this Id';
    } else user;
  }
  @Mutation()
  async createUser(@Args('data') data: UserCreateInput) {
    const newUser = await this.prisma.user.create({ data });
    return newUser;
  }
}
