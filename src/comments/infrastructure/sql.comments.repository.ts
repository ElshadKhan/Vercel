import { Injectable } from '@nestjs/common';
import { CreateCommentDbType } from '../application/dto/createCommentDbType';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class SqlCommentsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(newComment: CreateCommentDbType): Promise<CreateCommentDbType> {
    await this.dataSource.query(
      `INSERT INTO "Comments"("id", "userId", "postId", "content", "createdAt", "isBanned")
    VALUES ('${newComment.id}', '${newComment.commentatorInfo.userId}', '${newComment.postInfo.postId}', '${newComment.content}', '${newComment.createdAt}', '${newComment.isBanned}')`,
    );
    return newComment;
  }

  async update(commentId: string, content: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE "Comments" 
    SET "content" = '${content}'
    WHERE "id" = '${commentId}'`,
    );
    return result[1] === 1;
  }

  async banUsers(userId: string, value: boolean) {
    const result = await this.dataSource.query(
      `UPDATE "Comments"
    SET "isBanned" = ${value}
     WHERE "userId" = '${userId}'`,
    );
    return result[1] === 1;
  }

  async delete(id: string) {
    const result = await this.dataSource.query(
      `DELETE FROM "Comments" WHERE "id" = '${id}'`,
    );
    return result[1] === 1;
  }

  async deleteAll() {
    const result = await this.dataSource.query(`DELETE FROM "Comments"`);
    return result[1] === 1;
  }
}
