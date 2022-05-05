import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request): Promise<{ accesToken: string }> {
    const token = await this.authService.login(req.user as User);

    return token;
  }
}
