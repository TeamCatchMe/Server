import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | { error: string; status: number; message: string | string[] };

    if (typeof error === 'string') {
      response.status(status).json({
        status,
        success: false,
        error,
      });
    } else {
      response.status(status).json({
        status,
        success: false,
        message: !Array.isArray(error.message)
          ? error.message
          : error.message.length > 1
          ? error.message
          : error.message[0],
      });
    }
  }
}
