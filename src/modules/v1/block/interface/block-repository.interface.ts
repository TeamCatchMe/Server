import { Block } from '@prisma/client';

export const BLOCK_REPOSITORY = 'BLOCK REPOSITORY';

export interface BlockRepositoryInterface {
  block(userId: number, targetId: number): Promise<Block>;
  findByUserIdAndTargetId(userId: number, targetId: number): Promise<Block[]>;
}
