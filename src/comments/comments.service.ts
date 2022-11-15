import { Injectable } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { PostsQueryRepository } from '../posts/posts.queryRepository';
import { CommentDtoType, CreateCommentDbType } from './dto/create-comment.dto';
import { UserAccountDBType } from '../users/dto/user.db';

@Injectable()
export class CommentsService {
  constructor(
    public commentsRepository: CommentsRepository,
    public postsQueryRepository: PostsQueryRepository,
  ) {}
  async create(
    content: string,
    postId: string,
    user: UserAccountDBType,
  ): Promise<CommentDtoType | null> {
    const post = await this.postsQueryRepository.findOne(postId);
    if (!post) return null;
    const comment: CreateCommentDbType = {
      id: String(+new Date()),
      content: content,
      userId: user.id,
      userLogin: user.accountData.login,
      postId: postId,
      createdAt: new Date().toISOString(),
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
    const newComment = await this.commentsRepository.create(comment);
    return {
      id: newComment.id,
      content: newComment.content,
      userId: newComment.userId,
      userLogin: newComment.userLogin,
      createdAt: newComment.createdAt,
      likesInfo: {
        likesCount: newComment.likesInfo.likesCount,
        dislikesCount: newComment.likesInfo.dislikesCount,
        myStatus: newComment.likesInfo.myStatus,
      },
    };
  }

  update(commentId: string, content: string) {
    return this.commentsRepository.update(commentId, content);
  }

  delete(commentId: string) {
    return this.commentsRepository.delete(commentId);
  }

  deleteAll() {
    return this.commentsRepository.deleteAll();
  }
}
