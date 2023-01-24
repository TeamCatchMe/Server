import { Injectable } from '@nestjs/common';
import { Block } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { BlockRepositoryInterface } from './interface/block-repository.interface';

@Injectable()
export default class BlockRepository implements BlockRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async block(userId: number, targetId: number): Promise<Block> {
    return await this.prisma.block.create({
      data: {
        user_id: userId,
        target_id: targetId,
      },
    });
  }

  async findByUserIdAndTargetId(
    userId: number,
    targetId: number,
  ): Promise<Block[]> {
    const alreadyBlockedCharacter = await this.prisma.block.findMany({
      where: {
        user_id: userId,
        target_id: targetId,
      },
    });
    return alreadyBlockedCharacter;
  }

  //   async delete(userId: number): Promise<void> {
  //     await this.prisma.user.delete({
  //       where: { id: userId },
  //     });
  //   }
}
