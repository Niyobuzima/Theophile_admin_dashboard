import {user} from "@/generated/user_pb";
import { User, CreateUserDto, DailyStats } from "@/types/user.types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchPublicKey(): Promise<string> {
  const res = await fetch(`${API_URL}/keys/public`);
  if (!res.ok) throw new Error('Failed to fetch public key');
  return res.text();
}


export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function createUser(data: CreateUserDto): Promise<User> {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create user');
  }
  return res.json();
}

export async function updateUser(id: number, data: Partial<CreateUserDto>): Promise<User> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update user');
  }
  return res.json();
}

export async function deleteUser(id: number): Promise<User> {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete user');
  }
  return res.json();
}

// Protobuf Export
export async function fetchUsersProtobuf(): Promise<user.IUser[]> {
  const res = await fetch(`${API_URL}/users/export`);
  if (!res.ok) throw new Error('Failed to fetch users');
  const buffer = await res.arrayBuffer();

  const decoded: user.UserList = user.UserList.decode(new Uint8Array(buffer));
  console.log(decoded.users)
  return decoded.users;
}

// Analytics
export async function fetchDailyUserStats(): Promise<DailyStats[]> {
  const res = await fetch(`${API_URL}/users/analytics/daily`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

// Export utility
export async function exportUsersToFile(): Promise<Blob> {
  const res = await fetch(`${API_URL}/users/export`);
  if (!res.ok) throw new Error('Failed to export users');
  return res.blob();
}
