import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDbType } from '../comments/entities/comment.entity';
import { Model } from 'mongoose';
import { QueryValidationType } from '../middleware/queryValidation';
import { UserAccountDBType } from '../users/dto/user.db';
import { CommentsBusinessType } from './dto/create-comment.dto';

@Injectable()
export class CommentsQueryRepository {
  @InjectModel(Comment.name) private commentModel: Model<CommentDbType>;
  // async findCommentByUserIdAndCommentId(
  //   id: string,
  //   user?: UserAccountDBType,
  // ): Promise<CommentDtoType | null> {
  //   const comment = await CommentModelClass.findOne({ id: id });
  //   if (!comment) return null;
  //
  //   let myStatus = LikeStatusEnam.None;
  //
  //   if (user) {
  //     const result = await this.likeStatusRepository.getLikeStatus(id, user.id);
  //     myStatus = result?.type || LikeStatusEnam.None;
  //   }
  //
  //   const likesCount = await this.likeStatusRepository.getLikesCount(
  //     id,
  //     LikeStatusEnam.Like,
  //   );
  //   const dislikesCount = await this.likeStatusRepository.getDislikesCount(
  //     id,
  //     LikeStatusEnam.Dislike,
  //   );
  //
  //   return {
  //     id: comment.id,
  //     content: comment.content,
  //     userId: comment.userId,
  //     userLogin: comment.userLogin,
  //     createdAt: comment.createdAt,
  //     likesInfo: {
  //       likesCount: likesCount,
  //       dislikesCount: dislikesCount,
  //       myStatus: myStatus,
  //     },
  //   };
  // }

  async findCommentById(id: string): Promise<CommentDbType | null> {
    return await this.commentModel.findOne({ id });
  }

  async findCommentsByPostIdAndUserId(
    postId: string,
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    user?: UserAccountDBType,
  ): Promise<CommentsBusinessType | null> {
    const comment = await CommentModelClass.findOne({ postId: postId });
    const findComments = await CommentModelClass.find({ postId: postId })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountComments = await CommentModelClass.find({ postId: postId })
      .sort([[sortBy, sortDirection]])
      .count();
    if (comment) {
      const promis = findComments.map(async (c) => {
        let myStatus = LikeStatusEnam.None;

        if (user) {
          const result = await this.likeStatusRepository.getLikeStatus(
            c.id,
            user.id,
          );
          myStatus = result?.type || LikeStatusEnam.None;
        }
        const likesCount = await this.likeStatusRepository.getLikesCount(
          c.id,
          LikeStatusEnam.Like,
        );
        const dislikesCount = await this.likeStatusRepository.getDislikesCount(
          c.id,
          LikeStatusEnam.Dislike,
        );
        return {
          id: c.id,
          content: c.content,
          userId: c.userId,
          userLogin: c.userLogin,
          createdAt: c.createdAt,
          likesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
          },
        };
      });
      const items = await Promise.all(promis);
      return {
        pagesCount: getPagesCounts(totalCountComments, pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCountComments,
        items: items,
      };
    }
    return comment;
  }
}
