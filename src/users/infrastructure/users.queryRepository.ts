import { User, UserDbTypeWithId } from '../domain/entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { getPagesCounts, getSkipNumber } from '../../helpers/helpFunctions';
import { UsersBusinessType } from './dto/userBusinessDto';
import { UserAccountDBType } from '../domain/dto/user.account.dto';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import { LoginUserDto } from '../../auth/domain/dto/login.dto';
import {
  BloggerUsersBan,
  BloggerUsersBanDocument,
} from '../domain/entities/blogger.users.blogs.ban.entity';

@Injectable({ scope: Scope.DEFAULT })
export class UsersQueryRepository {
  @InjectModel(User.name) private userModel: Model<UserDbTypeWithId>;
  @InjectModel(BloggerUsersBan.name)
  private bloggerUsersBanModel: Model<BloggerUsersBanDocument>;

  async findUserById(id: string): Promise<UserAccountDBType | null> {
    return this.userModel.findOne({ id, 'banInfo.isBanned': false }).lean();
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string | LoginUserDto,
  ): Promise<UserAccountDBType | null> {
    return this.userModel
      .findOne({
        $or: [
          { 'accountData.login': loginOrEmail },
          { 'accountData.email': loginOrEmail },
        ],
      })
      .lean();
  }

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<UserAccountDBType | null> {
    return this.userModel
      .findOne({ 'emailConfirmation.confirmationCode': code })
      .lean();
  }

  async findUserByPasswordConfirmationCode(
    code: string,
  ): Promise<UserAccountDBType | null> {
    return this.userModel
      .findOne({ 'passwordConfirmation.confirmationCode': code })
      .lean();
  }

  async getBanUserForBlog(
    bloggerId: string,
    blogId: string,
  ): Promise<UserAccountDBType | null> {
    return await this.bloggerUsersBanModel.findOne({
      $and: [
        { blogId: blogId },
        { banUserId: bloggerId },
        { 'banInfo.isBanned': true },
      ],
    });
  }

  async getBanUsersForBlog(
    bloggerId: string,
    blogId: string,
    {
      searchLoginTerm,
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    }: QueryValidationType,
  ): Promise<UsersBusinessType> {
    const filter = {
      $and: [
        {
          login: {
            $regex: searchLoginTerm,
            $options: '(?i)a(?-i)cme',
          },
        },
        { blogId: blogId },
        { 'banInfo.isBanned': true },
      ],
    };
    const users = await this.bloggerUsersBanModel
      .find(filter, { _id: false, __v: 0 })
      .sort([[sortBy, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCount = await this.bloggerUsersBanModel.countDocuments(filter);
    const items = users.map((u) => ({
      id: u.banUserId,
      login: u.login,
      banInfo: {
        isBanned: u.banInfo.isBanned,
        banDate: u.banInfo.banDate,
        banReason: u.banInfo.banReason,
      },
    }));
    const userDto = new UsersBusinessType(
      getPagesCounts(totalCount, pageSize),
      pageNumber,
      pageSize,
      totalCount,
      items,
    );
    return userDto;
  }

  async getUsersForSa({
    searchLoginTerm,
    searchEmailTerm,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: QueryValidationType): Promise<UsersBusinessType> {
    const filter = {
      $or: [
        {
          'accountData.login': {
            $regex: searchLoginTerm,
            $options: '(?i)a(?-i)cme',
          },
        },
        {
          'accountData.email': {
            $regex: searchEmailTerm,
            $options: '(?i)a(?-i)cme',
          },
        },
      ],
    };
    const users = await this.userModel
      .find(filter)
      .sort([[`accountData.${sortBy}`, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountUsers = await this.userModel.find(filter).count();
    const items = users.map((user) => ({
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      createdAt: user.accountData.createdAt,
      banInfo: {
        isBanned: user.banInfo.isBanned,
        banDate: user.banInfo.banDate,
        banReason: user.banInfo.banReason,
      },
    }));
    const userDto = new UsersBusinessType(
      getPagesCounts(totalCountUsers, pageSize),
      pageNumber,
      pageSize,
      totalCountUsers,
      items,
    );
    return userDto;
  }
}
