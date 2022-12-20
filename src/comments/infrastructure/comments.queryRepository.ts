import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Comment,
  CommentDbTypeWithId,
} from '../domain/entities/comment.entity';
import { Model } from 'mongoose';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import { UserAccountDBType } from '../../users/domain/dto/user.account.dto';
import {
  getPagesCounts,
  getSkipNumber,
  LikeStatusEnam,
} from '../../helpers/helpFunctions';
import { LikesQueryRepository } from '../../likes/infrastructure/likes.queryRepository';
import { CommentDtoType } from '../application/dto/commentDtoType';
import { CommentsBusinessType } from './dto/commentBusinessType';

@Injectable()
export class CommentsQueryRepository {
  @InjectModel(Comment.name) private commentModel: Model<CommentDbTypeWithId>;
  constructor(private likesRepository: LikesQueryRepository) {}
  async findCommentByUserIdAndCommentId(
    id: string,
    userId?: string,
  ): Promise<CommentDtoType | null> {
    const comment = await this.commentModel.findOne({ id, isBan: false });
    if (!comment) return null;

    let myStatus = LikeStatusEnam.None;

    if (userId) {
      const result = await this.likesRepository.getLikeStatus(id, userId);
      myStatus = result?.type || LikeStatusEnam.None;
    }

    const likesCount = await this.likesRepository.getLikesCount(
      id,
      LikeStatusEnam.Like,
    );
    const dislikesCount = await this.likesRepository.getDislikesCount(
      id,
      LikeStatusEnam.Dislike,
    );

    return {
      id: comment.id,
      content: comment.content,
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: myStatus,
      },
    };
  }

  async findCommentById(
    id: string,
    userId?: string,
  ): Promise<CommentDtoType | null> {
    const comment = await this.commentModel.findOne({ id, isBan: false });
    if (!comment) return null;
    let myStatus = LikeStatusEnam.None;
    if (userId) {
      const result = await this.likesRepository.getLikeStatus(id, userId);
      myStatus = result?.type || LikeStatusEnam.None;
    }
    const likesCount = await this.likesRepository.getLikesCount(
      id,
      LikeStatusEnam.Like,
    );
    const dislikesCount = await this.likesRepository.getDislikesCount(
      id,
      LikeStatusEnam.Dislike,
    );
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin,
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: myStatus,
      },
    };
  }

  async findCommentsByPostIdAndUserId(
    postId: string,
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    userId?: string,
  ): Promise<CommentsBusinessType | null> {
    const comment = await this.commentModel.findOne({
      postId: postId,
      isBan: false,
    });
    const findComments = await this.commentModel
      .find({ postId: postId, isBan: false })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountComments = await this.commentModel
      .find({ postId: postId, isBan: false })
      .sort([[sortBy, sortDirection]])
      .count();
    if (comment) {
      const promise = findComments.map(async (c) => {
        let myStatus = LikeStatusEnam.None;

        if (userId) {
          const result = await this.likesRepository.getLikeStatus(c.id, userId);
          myStatus = result?.type || LikeStatusEnam.None;
        }
        const likesCount = await this.likesRepository.getLikesCount(
          c.id,
          LikeStatusEnam.Like,
        );
        const dislikesCount = await this.likesRepository.getDislikesCount(
          c.id,
          LikeStatusEnam.Dislike,
        );
        return {
          id: c.id,
          content: c.content,
          userId: c.commentatorInfo.userId,
          userLogin: c.commentatorInfo.userLogin,
          createdAt: c.createdAt,
          likesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
          },
        };
      });
      const items = await Promise.all(promise);
      return {
        pagesCount: getPagesCounts(totalCountComments, pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCountComments,
        items: items,
      };
    }
    return null;
  }
}
