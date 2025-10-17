import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

export const CreateUserDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Create a new user',
      description:
        'Creates a new user with email hashing (SHA-384) and RSA-PSS digital signature. Rate limited to 10 requests per minute.',
    }),
    ApiBody({ type: CreateUserDto }),
    ApiResponse({
      status: 201,
      description: 'User successfully created with cryptographic signature',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid input data (email format, invalid role, etc.)',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 429,
      description: 'Too many requests - Rate limit exceeded (10 req/min)',
    }),
  );

export const FindAllUsersDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all users',
      description:
        'Retrieves all users from the database ordered by creation date (descending). No rate limiting.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of all users with signatures',
      type: [UserResponseDto],
    }),
  );

export const UpdateUserDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Update user',
      description:
        'Updates user information (role, status). Rate limited to 20 requests per minute.',
    }),
    ApiParam({ name: 'id', description: 'User ID', type: Number, example: 1 }),
    ApiBody({ type: CreateUserDto, required: false }),
    ApiResponse({
      status: 200,
      description: 'User successfully updated',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
    ApiResponse({
      status: 429,
      description: 'Too many requests - Rate limit exceeded (20 req/min)',
    }),
  );

export const DeleteUserDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Delete user',
      description:
        'Permanently deletes a user from the database. Rate limited to 10 requests per minute.',
    }),
    ApiParam({
      name: 'id',
      description: 'User ID to delete',
      type: Number,
      example: 1,
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully deleted',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    }),
    ApiResponse({
      status: 429,
      description: 'Too many requests - Rate limit exceeded (10 req/min)',
    }),
  );

export const ExportUsersDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Export users as Protocol Buffer',
      description:
        'Exports all users in binary Protocol Buffer format. Includes signatures for verification. Rate limited to 30 requests per minute.',
    }),
    ApiResponse({
      status: 200,
      description: 'Binary protobuf data containing all users',
      content: {
        'application/octet-stream': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    ApiResponse({
      status: 429,
      description: 'Too many requests - Rate limit exceeded (30 req/min)',
    }),
  );
