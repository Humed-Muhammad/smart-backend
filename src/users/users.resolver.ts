import { Args, Resolver, Query, Mutation } from '@nestjs/graphql';
import { User } from '@generated/type-graphql';

@Resolver()
export class UsersResolver {
  users = [
    { id: '0', fullName: 'HUmed', email: 'yuit78687' },
    { id: '1', fullName: 'Ahmed', email: 'dfgdgfx675' },
  ];

  @Query('users')
  getUser() {
    return this.users;
  }

  @Mutation(() => User)
  createUser(@Args('input') input: User) {
    const id = `${this.users.length}` as string;
    const newUser = { id, ...input };
    console.log(newUser);
    this.users.push(newUser);
    return newUser;
  }
}
