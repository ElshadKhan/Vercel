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
import {
  CommentsBusinessDtoType,
  CommentsBusinessType,
} from './dto/commentBusinessType';
import { SqlLikesQueryRepository } from '../../likes/infrastructure/sql.likes.queryRepository';

@Injectable()
export class CommentsQueryRepository {
  @InjectModel(Comment.name) private commentModel: Model<CommentDbTypeWithId>;
  constructor(private likesRepository: SqlLikesQueryRepository) {}

  async findCommentByUserIdAndCommentId(
    id: string,
    userId?: string,
  ): Promise<CommentDtoType | null> {
    const comment = await this.commentModel.findOne({ id, isBanned: false });
    if (!comment) return null;

    let myStatus = LikeStatusEnam.None;

    if (userId) {
      const result = await this.likesRepository.getCommentLikesStatus(
        id,
        userId,
      );
      myStatus = result?.type || LikeStatusEnam.None;
    }

    const likesCount = await this.likesRepository.getCommentLikesCount(
      id,
      LikeStatusEnam.Like,
    );
    const dislikesCount = await this.likesRepository.getCommentDislikesCount(
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
    const comment = await this.commentModel.findOne({ id, isBanned: false });
    if (!comment) return null;
    let myStatus = LikeStatusEnam.None;
    if (userId) {
      const result = await this.likesRepository.getCommentLikesStatus(
        id,
        userId,
      );
      myStatus = result?.type || LikeStatusEnam.None;
    }
    const likesCount = await this.likesRepository.getCommentLikesCount(
      id,
      LikeStatusEnam.Like,
    );
    const dislikesCount = await this.likesRepository.getCommentDislikesCount(
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

  async findAllCommentsCurrentUser(
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    userId: string,
  ): Promise<CommentsBusinessDtoType | null> {
    const comment = await this.commentModel.findOne({
      'postInfo.ownerUserId': userId,
      isBanned: false,
    });
    const findComments = await this.commentModel
      .find({ 'postInfo.ownerUserId': userId, isBanned: false })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountComments = await this.commentModel
      .find({ 'postInfo.ownerUserId': userId, isBanned: false })
      .sort([[sortBy, sortDirection]])
      .count();
    if (comment) {
      const promise = findComments.map(async (c) => {
        let myStatus = LikeStatusEnam.None;

        if (userId) {
          const result = await this.likesRepository.getCommentLikesStatus(
            c.id,
            userId,
          );
          myStatus = result?.type || LikeStatusEnam.None;
        }
        const likesCount = await this.likesRepository.getCommentLikesCount(
          c.id,
          LikeStatusEnam.Like,
        );
        const dislikesCount =
          await this.likesRepository.getCommentDislikesCount(
            c.id,
            LikeStatusEnam.Dislike,
          );
        return {
          id: c.id,
          content: c.content,
          createdAt: c.createdAt,
          likesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
          },
          commentatorInfo: {
            userId: c.commentatorInfo.userId,
            userLogin: c.commentatorInfo.userLogin,
          },
          postInfo: {
            id: c.postInfo.postId,
            title: c.postInfo.title,
            blogId: c.postInfo.blogId,
            blogName: c.postInfo.blogName,
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

  async findCommentsByPostIdAndUserId(
    postId: string,
    { pageNumber, pageSize, sortBy, sortDirection }: QueryValidationType,
    userId?: string,
  ): Promise<CommentsBusinessType | null> {
    const comment = await this.commentModel.findOne({
      postId: postId,
      isBanned: false,
    });
    const findComments = await this.commentModel
      .find({ postId: postId, isBanned: false })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountComments = await this.commentModel
      .find({ postId: postId, isBanned: false })
      .sort([[sortBy, sortDirection]])
      .count();
    if (comment) {
      const promise = findComments.map(async (c) => {
        let myStatus = LikeStatusEnam.None;

        if (userId) {
          const result = await this.likesRepository.getCommentLikesStatus(
            c.id,
            userId,
          );
          myStatus = result?.type || LikeStatusEnam.None;
        }
        const likesCount = await this.likesRepository.getCommentLikesCount(
          c.id,
          LikeStatusEnam.Like,
        );
        const dislikesCount =
          await this.likesRepository.getCommentDislikesCount(
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
