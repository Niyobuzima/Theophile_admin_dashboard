import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CryptoService } from '../crypto/crypto.service';
import { CreateUserDto } from './dto/create-user.dto';
import { user } from '../generated/user_pb';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
  ) {}

  async create(dto: CreateUserDto) {
    const emailHash = this.crypto.hashEmail(dto.email);
    const signature = this.crypto.signHash(emailHash);

    return this.prisma.user.create({
      data: {
        email: dto.email,
        role: dto.role || 'user',
        status: dto.status || 'active',
        emailHash,
        signature,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async update(id: number, dto: Partial<CreateUserDto>) {
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async getUsersCreatedPerDay(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const users = await this.prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
    });

    const countsByDate = new Map<string, number>();
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      countsByDate.set(dateStr, 0);
    }

    for (const user of users) {
      const dateStr = user.createdAt.toISOString().split('T')[0];
      countsByDate.set(dateStr, (countsByDate.get(dateStr) || 0) + 1);
    }

    return Array.from(countsByDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async exportUsersProtobuf(): Promise<Buffer> {
    const users = await this.findAll();
    const payload = {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt.toISOString(),
        emailHash: u.emailHash,
        signature: u.signature,
      })),
    };

    const errMsg = user.UserList.verify(payload);
    if (errMsg) throw new Error(errMsg);

    const message = user.UserList.create(payload);
    return Buffer.from(user.UserList.encode(message).finish());
  }
}
