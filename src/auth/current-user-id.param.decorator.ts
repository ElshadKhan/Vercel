import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    console.log('111');
    const req = context.switchToHttp().getRequest();
    console.log('111userId', req.user);
    if (!req.user.id) throw new Error('Guard must be used');
    console.log('222');
    return req.user.id;
  },
);
