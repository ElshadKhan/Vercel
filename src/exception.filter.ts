import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    if (status === 400) {
      const errorResponse = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse();
      responseBody.message.forEach((m) => errorResponse.errorsMessages.push(m));
      response.status(status).json(errorResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log('Response', exception.getResponse());
    if (status === 429) {
      response.sendStatus(429);
      return;
    }
    if (status === 404) {
      response.sendStatus(404);
      return;
    }
    if (status === 401) {
      response.sendStatus(401);
      return;
    }
    if (status === 400) {
      const errorResponse = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse();
      responseBody.message.forEach((m) => errorResponse.errorsMessages.push(m));
      response.status(status).json(errorResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
