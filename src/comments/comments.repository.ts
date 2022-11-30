import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDbTypeWithId,
} from '../comments/entities/comment.entity';
import { Model } from 'mongoose';
import { CreateCommentDbType } from './dto/create-comment.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsRepository {
  @InjectModel(Comment.name) private commentModel: Model<CommentDbTypeWithId>;

  async create(newComment: CreateCommentDbType): Promise<CreateCommentDbType> {
    await this.commentModel.create(newComment);
    return newComment;
  }

  async update(commentId: string, content: string): Promise<boolean> {
    const result = await this.commentModel.updateOne(
      { id: commentId },
      { $set: { content: content } },
    );
    return result.matchedCount === 1;
  }

  async delete(id: string) {
    const result = await this.commentModel.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    const result = await this.commentModel.deleteMany({});
    return result.deletedCount === 1;
  }
}
