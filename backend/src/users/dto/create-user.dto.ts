import { IsEmail, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@example.com',
    type: String,
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: ['admin', 'user'],
    default: 'user',
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: string = 'user';

  @ApiProperty({
    description: 'User account status',
    enum: ['active', 'inactive'],
    default: 'active',
    example: 'active',
    required: false,
  })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: string = 'active';
}
