import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
  users = [
    { id: 0, fullName: 'HUmed' },
    { id: 1, fullName: 'Ahmed' },
  ];

  @Query('users')
  getUser() {
    return this.users;
  }

  @Mutation('createUser')
  createUser(@Args('fullName') fullName: string) {
    const id = this.users.length;
    const newUser = { id, fullName };
    this.users.push(newUser);
    return newUser;
  }
}
