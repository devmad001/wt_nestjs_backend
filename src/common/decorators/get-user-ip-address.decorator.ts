import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserIpAddress = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  },
);
