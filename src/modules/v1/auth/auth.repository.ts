import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AuthRepositoryInterface } from './auth.interface';

@Injectable()
export default class AuthRepository implements AuthRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  findById(id: number): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  create(): void {
    throw new Error('Method not implemented.');
  }
}
