import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import axios from 'axios';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (
      ['production', 'staging'].includes(process.env.NODE_ENV) &&
      httpStatus === HttpStatus.INTERNAL_SERVER_ERROR
    ) {
      const botToken = `6807849246:AAEjXUIKbybmpl6dAC8RVeSYRuuXF0sDP1Q`;
      const botUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const text = `*[env:${process.env.NODE_ENV}] [${request.url}] [${exception.name}]*\n${exception.message} \n ${exception.cause}`;
      axios.post(botUrl, null, {
        params: {
          text,
          chat_id: `453673673`,
          parse_mode: `markdown`,
        },
      });
    }

    httpAdapter.reply(ctx.getResponse(), exception['response'], httpStatus);
  }
}
