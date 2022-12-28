import { User } from '@prisma/client';

export const AUTH_REPOSITORY = 'AUTH REPOSITORY';

export interface AuthRepositoryInterface {
  findById(id: number): Promise<User>;
  findAll(): Promise<User[]>;
  create(): void;
}
