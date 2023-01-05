import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  //^ .env 값 접근
  get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + '은/는 설정되지 않은 환경 변수 입니다.');
    }

    return value;
  }

  //^ Number 환경변수 접근
  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + '의 타입이 Number가 아닙니다.');
    }
  }

  //^ Boolean 환경변수 접근
  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + '의 타입이 Boolean이 아닙니다.');
    }
  }

  //^ String 환경변수 접근
  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  //* 프로젝트 기본 환경설정
  get appConfig() {
    return {
      port: this.getString('PORT'),
      env: this.getString('NODE_ENV'),
    };
  }

  //* Auth 환경설정
  get authConfig() {
    return {
      secret: this.getString('JWT_SECRET'),
      algo: this.getString('JWT_ALGO'),
      accessExpiration: this.getString('JWT_ACCESS_EXPIRATION'),
      refreshExpiration: this.getString('JWT_REFRESH_EXPIRATION'),
      issuer: this.getString('JWT_ISSUER'),
    };
  }

  //* DB 환경설정
  get dbConfig() {
    return {
      dbType: this.getString('DB_TYPE'),
      dbPort: this.getNumber('DB_PORT'),
      dbHost: this.getString('DB_HOST'),
      dbUserName: this.getString('DB_USERNAME'),
      dbPassword: this.getString('DB_PASSWORD'),
      dbDbName: this.getString('DB_DATABASE_NAME'),
      dbSync: this.getBoolean('DB_SYNC'),
    };
  }

  //* S3 환경설정
  get awsS3Config() {
    return {
      bucket: this.getString('AWS_BUCKET'),
      bucketAccessKey: this.getString('AWS_ACCESS_KEY'),
      bucketSecretKey: this.getString('AWS_SECRET_ACCESS_KEY'),
      bucketRegion: this.getString('AWS_REGION'),
    };
  }

  //* JWT 환경설정
  get jwtConfig() {
    return {
      jwtSecret: this.getString('JWT_SECRET'),
      jwtAccessExpiration: this.getString('JWT_ACCESS_EXPIRATION'),
      jwtRefreshExpiration: this.getString('JWT_REFRESH_EXPIRATION'),
    };
  }

  //* Swagger
  get swaggerAdminConfig() {
    return {
      adminUser: this.getString('SWAGGER_ADMIN_USER'),
      adminPassword: this.getString('SWAGGER_ADMIN_PASSWORD'),
    };
  }
}
