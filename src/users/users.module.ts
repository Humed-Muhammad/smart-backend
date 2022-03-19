import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersResolver],
  exports: [UsersResolver],
  imports: [PrismaModule],
})
export class UsersModule {}
