import { ApiResponse, CreateUserDto, UpdateUserDto, UserOption } from "@/app/admin/interface/adminInterface";
import { api } from "@/lib/api/axios";

/* =======================
   API Calls
======================= */
export async function getUsers(): Promise<ApiResponse<UserOption>> {
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