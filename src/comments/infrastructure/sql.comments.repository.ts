import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDbTypeWithId,
} from '../domain/entities/comment.entity';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CreateCommentDbType } from '../application/dto/createCommentDbType';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlCommentsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  @InjectModel(Comment.name) private commentModel: Model<CommentDbTypeWithId>;

  async create(newComment: CreateCommentDbType): Promise<CreateCommentDbType> {
    await this.dataSource.query(
      `INSERT INTO "Comments"("id", "userId", "postId", "content", "createdAt", "isBanned")
    VALUES ('${newComment.id}', '${newComment.commentatorInfo.userId}', '${newComment.postInfo.postId}', '${newComment.content}', '${newComment.createdAt}', '${newComment.isBanned}')`,
    );
    return newComment;
  }

  async update(commentId: string, content: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE "Comments" SET "content" WHERE "id" = '${commentId}'`,
    );
    return result[0] === 1;
  }

  async banUsers(userId: string, value: boolean) {
    return await this.commentModel.updateMany(
      { 'commentatorInfo.userId': userId },
      {
        isBanned: value,
      },
    );
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
