import { api } from "@/lib/api/axios";

/* =======================
   Types
======================= */
type UserRole = 'client' | 'super_admin' | 'public';

export type UserOption = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  company_name?: string | null;
  contact_person?: string | null;
  phone?: string | null;
  providers: string[];
  is_active: boolean;
  created_at: string;
};

export type CreateUserDto = {
  username: string;
  email: string;
  password_hash: string;
  role?: "client" | "super_admin" | "public";
  company_name?: string;
  company_address?: string;
  contact_person?: string;
  phone?: string;
  providers?: string[];
  is_active: boolean;
};

export type UpdateUserDto = {
  username?: string;
  email?: string;
  password_hash: string;
  role?: "client" | "super_admin" | "public";
  company_name?: string;
  company_address?: string;
  contact_person?: string;
  phone?: string;
  providers?: string[];
  is_active?: boolean;
};

/* =======================
   API Calls
======================= */

export async function getUsers(): Promise<UserOption[]> {
  const res = await api.get("/admin/users");
  return res.data;
}

export async function createUser(payload: CreateUserDto) {
  const res = await api.post("/admin/users", payload);
  return res.data;
}

export async function updateUser(
  userId: number,
  payload: UpdateUserDto,
) {
  const res = await api.patch(`/admin/users/${userId}`, payload);
  return res.data;
}

export async function disableUser(userId: number) {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
}