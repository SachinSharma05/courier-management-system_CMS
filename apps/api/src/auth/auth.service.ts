import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../admin/users/users.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private users: UsersService) {}

    login(user: { id: number; email: string; role: string }) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwt.sign(payload, { expiresIn: '150m' }),
      refreshToken: this.jwt.sign(payload, { expiresIn: '7d' }),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // 1️⃣ Try bcrypt first (new users / migrated users)
    const valid = await argon2.verify(user.password_hash, password);
      if (!valid) {
        throw new UnauthorizedException('Invalid credentials');
      }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}