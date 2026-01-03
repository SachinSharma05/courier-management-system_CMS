import { api } from "@/lib/api/axios";

/* =======================
   Types
======================= */

export type UserOption = {
  id: number;
  username: string;
  email: string;
  role: string;
  is_active: boolean;
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
};

export type UpdateUserDto = {
  username?: string;
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