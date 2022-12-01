import { Module } from '@nestjs/common';
import { SessionsService } from './application/sessions.service';
import { SessionsController } from './api/sessions.controller';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionsModule {}
