import { Injectable, ExecutionContext, ContextType } from '@nestjs/common';

import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const reqType = context.getType<ContextType>();
    if (reqType === 'http') {
      return {
        req: context.switchToHttp().getRequest(),
        res: context.switchToHttp().getResponse(),
      };
    }
  }
}
