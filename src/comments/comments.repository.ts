import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDbType } from '../comments/entities/comment.entity';
import { Model } from 'mongoose';
import { CreateCommentDbType } from './dto/create-comment.dto';

export class CommentsRepository {
  @InjectModel(Comment.name) private postModel: Model<CommentDbType>;

  async create(newComment: CreateCommentDbType): Promise<CreateCommentDbType> {
    await this.postModel.create(newComment);
    return newComment;
  }

  async update(content: string, id: string): Promise<boolean> {
    const result = await this.postModel.updateOne(
      { id: id },
      { $set: { content: content } },
    );
    return result.matchedCount === 1;
  }

  async delete(id: string) {
    const result = await this.postModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    const result = await this.postModel.deleteMany({});
    return result.deletedCount === 1;
  }
}
