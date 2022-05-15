import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // Find the user in db
  async validate(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const validPassword = await compare(password, user.password);
    return validPassword ? user : 'Incorrect email or password!';
  }

  // Login and return token
  async login(user: User) {
    const payload = {
      email: user.email,
      id: user.id,
      fullName: user.fullName,
    };
    return {
      accesToken: this.jwtService.sign(payload, {
        secret: process.env.SECRET_KEY,
        noTimestamp: true,
      }),
    };
  }

  // verify token is valid
  async verify(token: string): Promise<User> {
    const decoded = await this.jwtService.verify(token, {
      secret: process.env.SECRET_KEY,
    });
    const user = await this.usersService.getUserByEmail(decoded.email);
    if (!user.email) {
      throw new Error('Invalid credential please try again!');
    }

    return user;
  }
}
