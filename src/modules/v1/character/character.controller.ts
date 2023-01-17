import { rm } from '@common/constants';
import { ResponseEntity } from '@common/constants/responseEntity';
import { CharacterCreateSuccess } from '@common/constants/swagger/domain/character/CharacterCreateSuccess';
import { ConflictError } from '@common/constants/swagger/error/ConflictError';
import { InternalServerError } from '@common/constants/swagger/error/InternalServerError';
import { UnauthorizedError } from '@common/constants/swagger/error/UnauthorizedError';
import { Token } from '@common/decorators/token.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Inject,
  Logger,
  LoggerService,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDTO } from '../user/dto/user.dto';
import { CharacterService } from './character.service';
import { CharacterCreateRequestDTO } from './dto/character-create.req.dto';

@ApiTags('Character API')
@Controller('character')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class CharacterController {
  constructor(
    private readonly characterService: CharacterService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @ApiOperation({
    summary: '캐츄를 생성합니다',
    description: ``,
  })
  @ApiOkResponse({
    description: '닉네임 변경에 성공했습니다.',
    type: CharacterCreateSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiConflictResponse({
    description: '이미 사용중인 닉네임입니다.',
    type: ConflictError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Post()
  async createCharacter(
    @Token() user: UserDTO,
    @Body() body: CharacterCreateRequestDTO,
  ): Promise<ResponseEntity<string>> {
    await this.characterService.createCharacter(
      user.id,
      body.name,
      body.type,
      body.is_public,
    );
    return ResponseEntity.OK_WITH(rm.CREATE_CHARACTER_SUCCESS);
  }
}
