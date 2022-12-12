import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserCreateInput } from 'src/@generated/user/user-create.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async getAllUsers() {
    return this.prisma.user.findMany();
  }
  async getOneUser(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) return null;
    return user;
  }
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return user;
    } else return null;
  }

  //Register user
  async register(data: UserCreateInput) {
    const hashedPassword = hashSync(data.password, 12);
    data.password = hashedPassword;
    const newUser = await this.prisma.user.create({ data });
    if (!newUser) throw new Error('Failed to create user');

    return true;
  }
}
