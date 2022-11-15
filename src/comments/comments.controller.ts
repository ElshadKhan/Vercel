import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsQueryRepository } from './comments.queryRepository';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsQueryRepository.findCommentById(id);
  }

  @Patch(':id')
  update(@Body() content, @Param('id') id: string) {
    return this.commentsService.update(content, id);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }

  @Delete()
  @HttpCode(204)
  deleteAll() {
    return this.commentsService.deleteAll();
  }
}
