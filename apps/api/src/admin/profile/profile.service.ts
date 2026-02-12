import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { ProfileResponseDto } from "./dto/profile-response.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { encrypt } from "../../utils/crypto";

@Injectable()
export class ProfileService {
  async getProfile(userId: number): Promise<ProfileResponseDto> {
    const [user] = await db
      .select({
        id: users.id,
        name: users.username,
        email: users.email,
        role: users.role,
        phone: users.phone,
        isActive: users.is_active,
        createdAt: users.created_at,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
  const updateData: Partial<typeof users.$inferInsert> = {};

  if (dto.name !== undefined) {
    updateData.username = dto.name;
  }

  if (dto.phone !== undefined) {
    updateData.phone = dto.phone;
  }

  if (dto.password !== undefined && dto.password.trim().length > 0) {
    const hashed = await encrypt(dto.password);
    updateData.password_hash = hashed;
  }

  // 🚨 CRITICAL GUARD
  if (Object.keys(updateData).length === 0) {
    throw new BadRequestException('No fields provided for update');
  }

  await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId));

  return this.getProfile(userId);
}

}
