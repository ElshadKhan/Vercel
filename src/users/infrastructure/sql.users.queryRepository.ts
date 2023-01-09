import { User, UserDbTypeWithId } from '../domain/entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { getPagesCounts, getSkipNumber } from '../../helpers/helpFunctions';
import { DataSource } from 'typeorm';
import { UsersBusinessType } from './dto/userBusinessDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserAccountDBType } from '../domain/dto/user.account.dto';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import { LoginUserDto } from '../../auth/domain/dto/login.dto';
import {
  BloggerUsersBan,
  BloggerUsersBanDocument,
} from '../domain/entities/blogger.users.blogs.ban.entity';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

@Injectable({ scope: Scope.DEFAULT })
export class SqlUsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  @InjectModel(User.name) private userModel: Model<UserDbTypeWithId>;
  @InjectModel(BloggerUsersBan.name)
  private bloggerUsersBanModel: Model<BloggerUsersBanDocument>;

  async findUserById(id: string): Promise<UserAccountDBType | null> {
    const user = await await this.dataSource.query(
      `SELECT 
    u.*,
    p."confirmationCode" AS passwordConfirmationCode,
    p."expirationDate" AS passwordExpirationDate,
    p."isConfirmed" AS passwordIsConfirmed,
    e."confirmationCode" AS emailConfirmationCode,
    e."expirationDate" AS emailExpirationDate,
    e."isConfirmed" AS emailIsConfirmed,
    b."isBanned",
    b."banReason",
    b."banDate" 
    FROM "Users" AS u
    LEFT JOIN "EmailConfirmation" AS e
    ON e."userId" = u."id"
    LEFT JOIN "PasswordConfirmation" AS p
    ON p."userId" = u."id"
    LEFT JOIN "BanInfo" AS b
    ON b."userId" = u."id"
    WHERE "id" = '${id}' 
    AND "isBanned" = false
    `,
    );
    const newUser = new UserAccountDBType(
      user.id,
      {
        login: user.login,
        email: user.email,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
      },
      {
        confirmationCode: user.emailconfirmationcode,
        expirationDate: user.emailexpirationdate,
        isConfirmed: user.emailisconfirmed,
      },
      {
        confirmationCode: user.passwordconfirmationcode,
        expirationDate: user.passwordexpirationdate,
        isConfirmed: user.passwordisconfirmed,
      },
      {
        isBanned: user.isBanned,
        banDate: user.banReason,
        banReason: user.banDate,
      },
    );
    return newUser;
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
    const users = await this.dataSource.query(
      `SELECT u.*, b."isBanned", b."banReason", b."banDate" 
    FROM "Users" AS u
    LEFT JOIN "BanInfo" as b
    ON b."userId" = u."id"
    WHERE "login" LIKE '%${searchLoginTerm}%'
    OR "email" LIKE '%${searchEmailTerm}%'
    ORDER BY "${sortBy}" ${sortDirection}`,
    );
    const totalCountUsers = await this.dataSource.query(
      `SELECT count(*) 
    FROM "Users"
    WHERE "login" LIKE '%${searchLoginTerm}%'
    OR "email" LIKE '%${searchEmailTerm}%'`,
    );
    const totalCount = +totalCountUsers[0].count;
    const items = users.map((user) => ({
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      banInfo: {
        isBanned: user.isBanned,
        banDate: user.banDate,
        banReason: user.banReason,
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
}
