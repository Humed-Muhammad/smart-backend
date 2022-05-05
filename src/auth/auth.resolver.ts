// import { UseGuards } from '@nestjs/common';
// import { Mutation, Resolver, Context, Args } from '@nestjs/graphql';
// import { User } from '@prisma/client';

// import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './guards/local.auth.guard';

// @Resolver()
// export class AuthResolver {
//   constructor(private authService: AuthService) {}

//   @UseGuards(LocalAuthGuard)
//   @Mutation()
//   async login(@Args('data') data: User): Promise<{ accesToken: string }> {
//     console.log(data);
//     try {
//       const token = await this.authService?.login(data);
//       return token;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }
// }
