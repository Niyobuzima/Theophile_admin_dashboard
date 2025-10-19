import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'User email address',
    example: 'admin@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: ['admin', 'user'],
    example: 'admin',
  })
  role: string;

  @ApiProperty({
    description: 'User account status',
    enum: ['active', 'inactive'],
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'SHA-384 hash of user email (96 hex characters)',
    example: 'c7f2d8a3e1b9f4c6a2d5e8f1b3c6d9e2f5a8b1c4d7e0f3a6b9c2d5e8f1a4b7c0d3e6f9a2b5c8d1e4f7a0b3c6d9e2f5a8',
    type: String,
    minLength: 96,
    maxLength: 96,
  })
  emailHash: string;

  @ApiProperty({
    description: 'Base64-encoded RSA-PSS signature of emailHash',
    example: 'bGVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ciBhZGlwaXNjaW5nIGVsaXQ=',
    type: String,
  })
  signature: string;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2025-10-14T12:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  createdAt: string;
}

export class DailyStatsDto {
  @ApiProperty({
    description: 'Date in ISO format (YYYY-MM-DD)',
    example: '2025-10-14',
    type: String,
  })
  date: string;

  @ApiProperty({
    description: 'Number of users created on this date',
    example: 5,
    type: Number,
    minimum: 0,
  })
  count: number;
}
