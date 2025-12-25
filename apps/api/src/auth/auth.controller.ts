import { Controller, Post, Get, Res, Body, Req, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  async login( // Added async
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    // 1. Added await here!
    const user = await this.auth.validateUser(body.email, body.password);

    // 2. Generate tokens
    const { accessToken, refreshToken } = this.auth.login(user);

    // 3. Set Cookies
    res.setCookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Security: only send over HTTPS in prod
      sameSite: 'lax',
      path: '/',
    });

    res.setCookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { 
      message: 'Login successful', 
      user: { id: user.id, email: user.email, role: user.role } 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return req.user;
  }
}