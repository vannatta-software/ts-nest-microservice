import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let errors = undefined;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            message = exception.message;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        if (exception instanceof ApiException) {
            errors = exception.errors;
        }

        response
            .status(status)
            .json({
                statusCode: status,
                errors: errors ?? {},
                feedback: message,
            });
    }

    public static get Provider() {
        return {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        }
    }
}

export class ApiException extends HttpException {
  constructor(
    message: string, 
    public errors?: { [error: string]: string[] }, 
    status: number = HttpStatus.BAD_REQUEST) {
      super(message, status);
  }  
}

export class NotFoundException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.NOT_FOUND);
    }  
}