import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): string => {
    const req = context.switchToHttp().getRequest();
    if (!req.user?.id) throw new Error('Guard must be used');
    return req.user.id;
  },
);
