import { Injectable, UnauthorizedException } from '@nestjs/common';
import { rm } from 'src/common/constants';
import { JwtPayload } from 'src/common/constants/jwt/jwtPayload';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class DataValidatorService {
  constructor(private readonly prisma: PrismaService) {}

  //* 유저 Validation
  async validateUser(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.id,
        is_delete: false,
      },
    });

    if (!user) {
      throw new UnauthorizedException(rm.UNAUTHORIZED_USER);
    }

    return payload;
  }
}
