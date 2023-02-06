import { rm } from '@common/constants';
import { ResponseEntity } from '@common/constants/responseEntity';
import { CharacterBlockSuccess } from '@common/constants/swagger/domain/character/CharacterBlockSuccess';
import { CharacterCreateSuccess } from '@common/constants/swagger/domain/character/CharacterCreateSuccess';
import { CharacterEditSuccess } from '@common/constants/swagger/domain/character/CharacterEditSuccess';
import { CharacterGetListSuccess } from '@common/constants/swagger/domain/character/CharacterGetFromMainSuccess';
import { CharacterGetFromMainSuccess } from '@common/constants/swagger/domain/character/CharactersListSuccess';
import { ConflictError } from '@common/constants/swagger/error/ConflictError';
import { InternalServerError } from '@common/constants/swagger/error/InternalServerError';
import { UnauthorizedError } from '@common/constants/swagger/error/UnauthorizedError';
import { Token } from '@common/decorators/token.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { routesV1 } from '@config/routes.config';
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Patch,
  Post,
  Query,
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
import { CharacterBlockRequestDTO } from './dto/character-block.req.dto';
import { CharacterCreateRequestDTO } from './dto/character-create.req.dto';
import { CharacterIdParamsDTO } from './dto/character-detail.params.dto';
import { CharacterEditRequestDTO } from './dto/character-edit.req.dto';
import { CharacterGetFromMainResponseDTO } from './dto/character-get-from-main.res.dto';
import { CharactersResponseDTO } from './dto/characters.res.dto';
import { SortType } from './interfaces/sort-type';

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
    description: '캐츄 생성에 성공했습니다.',
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
  @Post(routesV1.character.create)
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

  @ApiOperation({
    summary: '캐츄를 수정합니다',
    description: ``,
  })
  @ApiOkResponse({
    description: '캐츄 수정에 성공했습니다.',
    type: CharacterEditSuccess,
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
  @Patch(routesV1.character.update)
  async editCharacter(
    @Token() user: UserDTO,
    @Body() body: CharacterEditRequestDTO,
  ): Promise<ResponseEntity<string>> {
    await this.characterService.editCharacter(
      user.id,
      body.id,
      body.name,
      body.is_public,
    );
    return ResponseEntity.OK_WITH(rm.EDIT_CHARACTER_SUCCESS);
  }

  @ApiOperation({
    summary: '캐츄를 차단합니다',
    description: ``,
  })
  @ApiOkResponse({
    description: '캐츄 차단에 성공했습니다.',
    type: CharacterBlockSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiConflictResponse({
    description: '존재하지 않는 캐츄 Id입니다. | 이미 차단한 캐츄입니다.',
    type: ConflictError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Post(routesV1.character.block)
  async blockCharacter(
    @Token() user: UserDTO,
    @Body() body: CharacterBlockRequestDTO,
  ): Promise<ResponseEntity<string>> {
    await this.characterService.blockCharacter(user.id, body.id);
    return ResponseEntity.OK_WITH(rm.BLOCK_CHARACTER_SUCCESS);
  }

  @ApiOperation({
    summary: '메인에서 캐츄 목록을 조회합니다',
    description: ``,
  })
  @ApiOkResponse({
    description: '캐츄 메인 목록 조회에 성공했습니다.',
    type: CharacterGetFromMainSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Get(routesV1.character.main)
  async getCharactersFromMain(
    @Token() user: UserDTO,
  ): Promise<ResponseEntity<CharacterGetFromMainResponseDTO[]>> {
    const characters = await this.characterService.getCharactersFromMain(
      user.id,
    );
    return ResponseEntity.OK_WITH_DATA(
      rm.READ_CHARACTERS_FROM_MAIN_SUCCESS,
      characters,
    );
  }

  @ApiOperation({
    summary: '캐츄 목록을 조회합니다',
    description: `query값으로 sort 타입을 전달받습니다 (예시 : /list?sort=most)<br>sort의 값으로, 최다 활동순은 'most', 생성일 순은 'birth', 최근 활동순은 'recent'를 입력해주면 됩니다.`,
  })
  @ApiOkResponse({
    description: '캐츄 목록 조회에 성공했습니다.',
    type: CharacterGetListSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Get(routesV1.character.list)
  async getCharactersWithSort(
    @Token() user: UserDTO,
    @Query('sort') sort: SortType,
  ): Promise<ResponseEntity<CharactersResponseDTO[]>> {
    const characters = await this.characterService.getCharacters(user.id, sort);
    return ResponseEntity.OK_WITH_DATA(
      rm.READ_CHARACTERS_LIST_SUCCESS,
      characters,
    );
  }

  @ApiOperation({
    summary: '캐츄 정보를 조회합니다',
    description: ``,
  })
  @ApiOkResponse({
    description: '캐츄 조회에 성공했습니다.',
    type: CharacterGetListSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Get(routesV1.character.detail)
  async getCharacterDetail(
    @Token() user: UserDTO,
    @Param() params: CharacterIdParamsDTO,
  ): Promise<ResponseEntity<CharactersResponseDTO>> {
    const character = await this.characterService.getCharacterDetail(
      params.character_id,
    );
    return ResponseEntity.OK_WITH_DATA(
      rm.READ_CHARACTER_DETAIL_SUCCESS,
      character,
    );
  }
}
