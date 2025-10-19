import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiProduces } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  CreateUserDocs,
  FindAllUsersDocs,
  UpdateUserDocs,
  DeleteUserDocs,
  ExportUsersDocs,
} from './documentation/users.swagger';
import { GetDailyAnalyticsDocs } from './documentation/analytics.swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @CreateUserDocs()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @SkipThrottle()
  @FindAllUsersDocs()
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @UpdateUserDocs()
  update(@Param('id') id: string, @Body() dto: Partial<CreateUserDto>) {
    return this.usersService.update(+id, dto);
  }

  @Delete(':id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @DeleteUserDocs()
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('export')
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Header('Content-Type', 'application/octet-stream')
  @ApiProduces('application/octet-stream')
  @ExportUsersDocs()
  async exportUsers(@Res() res: Response) {
    const buffer = await this.usersService.exportUsersProtobuf();
    res.send(buffer);
  }

  @Get('analytics/daily')
  @SkipThrottle()
  @ApiTags('analytics')
  @GetDailyAnalyticsDocs()
  async getDailyAnalytics() {
    return this.usersService.getUsersCreatedPerDay(7);
  }
}
