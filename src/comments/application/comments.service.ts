import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.queryRepository';
import { UsersQueryRepository } from '../../users/infrastructure/users.queryRepository';

@Injectable()
export class CommentsService {
  constructor(
    public commentsRepository: CommentsRepository,
    public postsQueryRepository: PostsQueryRepository,
    public usersQueryRepository: UsersQueryRepository,
  ) {}

  // async create(
  //   content: string,
  //   postId: string,
  //   userId: string,
  // ): Promise<CommentDtoType | null> {
  //   const user = await this.usersQueryRepository.getUser(userId);
  //   const post = await this.postsQueryRepository.findOne(postId, userId);
  //   if (!post) return null;
  //   const comment: CreateCommentDbType = {
  //     id: String(+new Date()),
  //     content: content,
  //     userId: userId,
  //     userLogin: user.accountData.login,
  //     postId: postId,
  //     createdAt: new Date().toISOString(),
  //     likesInfo: {
  //       likesCount: 0,
  //       dislikesCount: 0,
  //       myStatus: LikeStatusEnam.None,
  //     },
  //   };
  //   const newComment = await this.commentsRepository.create(comment);
  //   return {
  //     id: newComment.id,
  //     content: newComment.content,
  //     userId: newComment.userId,
  //     userLogin: newComment.userLogin,
  //     createdAt: newComment.createdAt,
  //     likesInfo: {
  //       likesCount: newComment.likesInfo.likesCount,
  //       dislikesCount: newComment.likesInfo.dislikesCount,
  //       myStatus: newComment.likesInfo.myStatus,
  //     },
  //   };
  // }

  // update(commentId: string, content: string) {
  //   return this.commentsRepository.update(commentId, content);
  // }
  //
  // delete(id: string) {
  //   return this.commentsRepository.delete(id);
  // }
  //
  // deleteAll() {
  //   return this.commentsRepository.deleteAll();
  // }
}
