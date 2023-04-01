import { rm } from '@common/constants';
import { ResponseEntity } from '@common/constants/responseEntity';
import { ActivityCreateSuccess } from '@common/constants/swagger/domain/activity/ActivityCreateSuccess';
import { ActivityDateGetSuccess } from '@common/constants/swagger/domain/activity/ActivityDateGetSuccess';
import { ActivityDeleteSuccess } from '@common/constants/swagger/domain/activity/ActivityDeleteSuccess';
import { ActivityUpdateSuccess } from '@common/constants/swagger/domain/activity/ActivityUpdateSuccess';
import { UserPatchNicknameSuccess } from '@common/constants/swagger/domain/user/UserPatchNicknameSuccess';
import { InternalServerError } from '@common/constants/swagger/error/InternalServerError';
import { UnauthorizedError } from '@common/constants/swagger/error/UnauthorizedError';
import { ApiImageFile } from '@common/decorators/api-file.decorator';
import { Token } from '@common/decorators/token.decorator';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { routesV1 } from '@config/routes.config';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import { ActivityDateAllGetSuccess } from '../../../common/constants/swagger/domain/activity/ActivityDateAllGetSuccess';
import { UserDTO } from '../user/dto/user.dto';
import { ActivityService } from './activity.service';
import { ActivityCharacterParamsDTO } from './dto/activity-character.params.dto';
import { ActivityCreateRequestDto } from './dto/activity-create.req.dto';
import { ActivityDateParamsDTO } from './dto/activity-date.params.dto';
import { ActivityUpdateRequestDto } from './dto/activity-update.req.dto';
import { ActivityParamsDto } from './dto/activity.params.dto';
import { ActivityQueryDTO } from './dto/activity.query.dto';
import { ActivityResponseDTO } from './dto/activity.res.dto';
dayjs.extend(CustomParseFormat);

@ApiTags('Activity API')
@UseGuards(JwtAuthGuard)
@Controller(routesV1.version)
@ApiBearerAuth('Authorization')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @ApiOperation({
    summary: '특정 캐츄의 활동들을 조회합니다.',
    description: `
    Params로 특정 캐츄의 id를 받고 해당 캐츄로 작성했던 
    삭제되지 않은 모든 활동들을 조회합니다.
    `,
  })
  @ApiOkResponse({
    description: '캐츄 활동 조회에 성공했습니다.',
    type: UserPatchNicknameSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Get(routesV1.activity.character)
  async getCharacterActivities(
    @Param() params: ActivityCharacterParamsDTO,
  ): Promise<ResponseEntity<ActivityResponseDTO[]>> {
    const data = await this.activityService.getActivitiesByCharacterId(
      params.character_id,
    );
    return ResponseEntity.OK_WITH_DATA(rm.READ_ACTIVITY_SUCCESS, data);
  }

  @ApiImageFile('image')
  @ApiOperation({
    summary: '활동을 작성합니다.',
    description: `
    이미지 파일이 아닌 경우엔 400 에러를 출력합니다. \n
    헤더에 토큰 값을 제대로 설정하지 않으면 401 에러를 출력합니다. \n
    이미지 파일을 포함하지 않는 경우 요청 바디에 file 프로퍼티를 제외해야 합니다.
    `,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        character_id: {
          type: 'string',
          description: '활동을 작성하는 캐츄의 id 값입니다.',
        },
        content: { type: 'string', description: '활동 내용 값입니다.' },
        date: { type: 'string', description: '활동 일자 값입니다. (YYYYMMDD)' },
        file: {
          type: 'string',
          format: 'binary',
          description: '활동에 들어가는 이미지 파일입니다.',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: '활동 작성에 성공했습니다.',
    type: ActivityCreateSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Post(routesV1.activity.create)
  async createActivity(
    @Token() user: UserDTO,
    @Body() body: ActivityCreateRequestDto,
    @UploadedFile() file?: any,
  ): Promise<ResponseEntity<ActivityResponseDTO>> {
    const url = file ? file.transforms[0].location : null;
    const data = await this.activityService.createActivity(
      user.id,
      body.character_id,
      body.content,
      body.date,
      url,
    );
    return ResponseEntity.CREATED_WITH_DATA(rm.CREATE_ACTIVITY_SUCCESS, data);
  }

  @ApiOperation({
    summary: '특정 활동을 수정합니다.',
    description: `
    이미지 파일을 필수로 받고, 이미지 파일이 아닌 경우엔 400 에러를 출력합니다. \n
    헤더에 토큰 값을 제대로 설정하지 않으면 401 에러를 출력합니다. \n
    `,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: '활동 내용 값입니다.' },
        date: { type: 'string', description: '활동 일자 값입니다. (YYYYMMDD)' },
        file: {
          type: 'string',
          format: 'binary',
          description: '활동에 들어가는 이미지 파일입니다.',
        },
      },
      required: ['file'],
    },
  })
  @ApiOkResponse({
    description: '활동 수정에 성공했습니다.',
    type: ActivityUpdateSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Patch(routesV1.activity.update)
  async updateActivity(
    @Token() user: UserDTO,
    @Param() params: ActivityParamsDto,
    @UploadedFile() file: any,
    @Body() body: ActivityUpdateRequestDto,
  ): Promise<ResponseEntity<ActivityResponseDTO>> {
    const url = file.transforms[0].location;
    const data = await this.activityService.updateActivity(
      user.id,
      params.activity_id,
      body.content,
      body.date,
      url ? url : null,
    );

    return ResponseEntity.OK_WITH_DATA(rm.UPDATE_ACTIVITY_SUCCESS, data);
  }

  @ApiOperation({
    summary: '특정 활동을 삭제합니다.',
    description: `
    Params로 받은 index에 해당하는 활동 데이터를 삭제합니다. \n
    헤더에 토큰 값을 제대로 설정하지 않으면 401 에러를 출력합니다. \n
    삭제된 활동은 복구가 가능합니다.
    `,
  })
  @ApiOkResponse({
    description: '활동 삭제에 성공했습니다.',
    type: ActivityDeleteSuccess,
  })
  @ApiUnauthorizedResponse({
    description: '인증 되지 않은 요청입니다.',
    type: UnauthorizedError,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류',
    type: InternalServerError,
  })
  @Delete(routesV1.activity.delete)
  async deleteActivity(
    @Token() user: UserDTO,
    @Param() params: ActivityParamsDto,
  ): Promise<ResponseEntity<string>> {
    await this.activityService.deleteActivity(user.id, params.activity_id);
    return ResponseEntity.OK_WITH(rm.DELETE_ACTIVITY_SUCCESS);
  }
}
