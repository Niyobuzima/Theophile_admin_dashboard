export interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  emailHash: string;
  signature: string;
  verified?: boolean;
}

export interface CreateUserDto {
  email: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive';
}

export interface DailyStats {
  date: string;
  count: number;
}