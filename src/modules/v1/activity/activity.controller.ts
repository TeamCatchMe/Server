import { rm } from '@common/constants';
import { ResponseEntity } from '@common/constants/responseEntity';
import { UserPatchNicknameSuccess } from '@common/constants/swagger/domain/user/UserPatchNicknameSuccess';
import { InternalServerError } from '@common/constants/swagger/error/InternalServerError';
import { UnauthorizedError } from '@common/constants/swagger/error/UnauthorizedError';
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
import { UserDTO } from '../user/dto/user.dto';
import { ActivityService } from './activity.service';
import { ActivityCreateRequestDto } from './dto/activity-create.req.dto';
import { ActivityDateParamsDTO } from './dto/activity-date.params.dto';
import { ActivityUpdateRequestDto } from './dto/activity-update.req.dto';
import { ActivityParamsDto } from './dto/activity.params.dto';
import { ActivityQueryDTO } from './dto/activity.query.dto';
dayjs.extend(CustomParseFormat);

@ApiTags('Activity API')
@UseGuards(JwtAuthGuard)
@Controller(routesV1.version)
@ApiBearerAuth('Authorization')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  //todo [GET] 캘린더 조회
  @ApiOperation({
    summary: '날짜 범위 내의 캘린더 데이터를 조회합니다.',
    description: ``,
  })
  @ApiOkResponse({
    description: '캘린더 조회에 성공했습니다.',
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
  @Get(routesV1.activity.calender)
  async getCalendar(
    @Token() user: UserDTO,
    @Query() query: ActivityQueryDTO,
  ): Promise<ResponseEntity<any>> {
    const data = await this.activityService.getCalender(
      user.id,
      query.startDate,
      query.endDate,
    );
    return ResponseEntity.OK_WITH_DATA(rm.READ_ACTIVITY_SUCCESS, data);
  }

  //todo [GET] 특정 일자 캐릭터 조회
  @ApiOperation({
    summary: '특정 일자의 캐릭터를 조회합니다.',
    description: ``,
  })
  @ApiOkResponse({
    description: '캘린더 조회에 성공했습니다.',
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
  @Get(routesV1.activity.specificDate)
  async getSpecificDate(
    @Token() user: UserDTO,
    @Param() params: ActivityDateParamsDTO,
  ): Promise<ResponseEntity<any>> {
    const data = await this.activityService.getSpecificDate(
      user.id,
      params.date,
    );
    return ResponseEntity.OK_WITH_DATA(rm.READ_ACTIVITY_SUCCESS, data);
  }

  //todo [POST] 활동 작성
  @ApiOperation({
    summary: '활동을 작성합니다.',
    description: `
    이미지 파일이 아닌 경우엔 400 에러를 출력합니다. \n
    헤더에 토큰 값을 제대로 설정하지 않으면 401 에러를 출력합니다. \n
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
      required: ['file'],
    },
  })
  @ApiCreatedResponse({
    description: '활동 작성에 성공했습니다.',
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
  @Post(routesV1.activity.create)
  async createActivity(
    @Token() user: UserDTO,
    @UploadedFile() file: Express.MulterS3.File,
    @Body() body: ActivityCreateRequestDto,
  ): Promise<ResponseEntity<any>> {
    const url = file.location;
    const data = await this.activityService.createActivity(
      user.id,
      body.character_id,
      body.content,
      body.date,
      url ? url : null,
    );
    return ResponseEntity.CREATED_WITH_DATA(rm.CREATE_ACTIVITY_SUCCESS, data);
  }

  //todo [PATCH] 활동 수정
  @ApiOperation({
    summary: '특정 활동을 수정합니다.',
    description: ``,
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
  @Patch(routesV1.activity.update)
  async updateActivity(
    @Token() user: UserDTO,
    @Param() params: ActivityParamsDto,
    @UploadedFile() file: Express.MulterS3.File,
    @Body() body: ActivityUpdateRequestDto,
  ): Promise<ResponseEntity<any>> {
    const url = file.location;
    const data = await this.activityService.updateActivity(
      user.id,
      params.activity_id,
      body.content,
      body.date,
      url ? url : null,
    );

    return ResponseEntity.OK_WITH_DATA(rm.UPDATE_ACTIVITY_SUCCESS, data);
  }

  //todo [DELETE] 활동 삭제
  @ApiOperation({
    summary: '특정 활동을 삭제합니다.',
    description: ``,
  })
  @ApiOkResponse({
    description: '활동 삭제에 성공했습니다.',
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
  @Delete(routesV1.activity.delete)
  async deleteActivity(
    @Token() user: UserDTO,
    @Param() params: ActivityParamsDto,
  ): Promise<ResponseEntity<any>> {
    await this.activityService.deleteActivity(user.id, params.activity_id);
    return ResponseEntity.OK_WITH(rm.DELETE_ACTIVITY_SUCCESS);
  }
}