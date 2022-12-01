import { Module } from '@nestjs/common';
import { LikesService } from './application/likes.service';

@Module({
  providers: [LikesService],
})
export class LikesModule {}
