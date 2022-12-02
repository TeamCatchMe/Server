import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { sc } from './';
import { ResponseStatus } from './statusCode';

export class ResponseEntity<T> {
  @Exclude() private readonly status: ResponseStatus;
  @Exclude() private readonly message: string;
  @Exclude() private readonly data: T;

  private constructor(status: ResponseStatus, message: string, data?: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static OK(): ResponseEntity<string> {
    return new ResponseEntity<string>(sc.OK, '', '');
  }

  static OK_WITH(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(sc.OK, message);
  }

  static OK_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(sc.OK, message, data);
  }

  static CREATED(): ResponseEntity<string> {
    return new ResponseEntity<string>(sc.CREATED, '', '');
  }

  static CREATED_WITH(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(sc.CREATED, message);
  }

  static CREATED_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(sc.CREATED, message, data);
  }

  static ACCEPTED(): ResponseEntity<string> {
    return new ResponseEntity<string>(sc.ACCEPTED, '', '');
  }

  static ACCEPTED_WITH(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(sc.ACCEPTED, message);
  }

  static ACCEPTED_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(sc.ACCEPTED, message, data);
  }

  static NO_CONTENT(): ResponseEntity<string> {
    return new ResponseEntity<string>(sc.NO_CONTENT, '', '');
  }

  static NO_CONTENT_WITH(message: string): ResponseEntity<string> {
    return new ResponseEntity<string>(sc.NO_CONTENT, message);
  }

  static NO_CONTENT_WITH_DATA<T>(message: string, data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(sc.NO_CONTENT, message, data);
  }

  @ApiProperty({
    title: '응답 코드',
    example: '200 | 201 | 500',
  })
  @Expose()
  get getStatus(): ResponseStatus {
    return this.status;
  }

  @ApiProperty({
    title: '응답 메시지',
    example: `'' | 서버 에러가 발생했습니다. | 입력 값`,
  })
  @Expose()
  get getMessage(): string {
    return this.message;
  }

  @ApiProperty({
    title: '응답 데이터',
    example: `'' | {}`,
  })
  @Expose()
  get getData(): T {
    return this.data;
  }
}
