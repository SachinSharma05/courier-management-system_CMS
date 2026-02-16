import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../admin/users/users.service';
import * as argon2 from 'argon2';
import { FastifyReply } from 'fastify';
import { decrypt } from '../utils/crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private users: UsersService) {}

    login(
      user: { id: number; email: string; role: string },
      res: FastifyReply,
    ) {
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwt.sign(payload, { expiresIn: '150m' });

      res.setCookie('access_token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
      });

      return { ok: true };
    }

  async validateUser(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let isValid = false;
    let needsMigration = false;

    // STEP 1: Check if it's an Argon2 Hash (starts with $)
    if (user.password_hash?.startsWith('$')) {
      try {
        isValid = await argon2.verify(user.password_hash, password);
      } catch (e) {
        isValid = false; // Prevents the 'pchstr' crash
      }
    } 
    
    // STEP 2: Fallback to Legacy Decryption
    if (!isValid) {
      try {
        const decrypted = await decrypt(user.password_hash);
        if (decrypted === password) {
          isValid = true;
          needsMigration = true; // Mark for upgrade
        }
      } catch (e) {
        isValid = false;
      }
    }

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // STEP 3: Background Migration (Fire and Forget)
    if (needsMigration) {
      this.migrateToArgon2(user.id, password);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  private async migrateToArgon2(userId: number, plainPassword: string) {
    try {
      // 1. Generate a new high-security hash
      const newHash = await argon2.hash(plainPassword);

      // 2. Update the user record in the database
      // This replaces the legacy encrypted string with an Argon2 hash
      await this.users.update(userId, { 
        password_hash: newHash 
      });

      console.log(`[Security] User ${userId} successfully migrated to Argon2.`);
    } catch (error) {
      // Log the error but don't crash the login—the user is already validated
      console.error(`[Security] Failed to migrate user ${userId}:`, error);
    }
  }
}