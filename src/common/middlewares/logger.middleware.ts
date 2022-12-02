import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const loggerService = new LoggerService(req.url.slice(1).split('/')[0]);
    const tempUrl = req.method + ' ' + req.url.split('?')[0];
    const _headers = JSON.stringify(req.headers ? req.headers : {});
    const _query = JSON.stringify(req.query ? req.query : {});
    const _body = JSON.stringify(req.body ? req.body : {});
    const _url = JSON.stringify(tempUrl ? tempUrl : {});

    loggerService.log(`${_url} ${_headers} ${_query} ${_body}`.replace(/\\/, ''));
    next();
  }
}
