import { Injectable, Scope } from '@nestjs/common';
import { getPagesCounts, getSkipNumber } from '../../helpers/helpFunctions';
import { DataSource } from 'typeorm';
import { UsersBusinessType } from './dto/userBusinessDto';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserAccountDBType } from '../domain/dto/user.account.dto';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import { LoginUserDto } from '../../auth/domain/dto/login.dto';

@Injectable({ scope: Scope.DEFAULT })
export class SqlUsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

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
    LEFT JOIN "UsersBanInfo" AS b
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
    const user = await this.dataSource.query(
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
    LEFT JOIN "UsersBanInfo" AS b
    ON b."userId" = u."id"
    WHERE "login" = '%${loginOrEmail}%'
    OR "email" = '%${loginOrEmail}%'`,
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

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<UserAccountDBType | null> {
    const user = await this.dataSource.query(
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
    LEFT JOIN "UsersBanInfo" AS b
    ON b."userId" = u."id"
    WHERE e."confirmationCode" = '${code}'`,
    );

    if (!user) return user;

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

  async findUserByPasswordConfirmationCode(
    code: string,
  ): Promise<UserAccountDBType | null> {
    const user = await this.dataSource.query(
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
    LEFT JOIN "UsersBanInfo" AS b
    ON b."userId" = u."id"
    WHERE p."confirmationCode" = '${code}'`,
    );

    if (!user) return user;

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

  async getBanUserForBlog(
    banUserId: string,
    blogId: string,
  ): Promise<UserAccountDBType | null> {
    return await this.dataSource.query(
      `SELECT blogger.*, blogs."userId" AS blogowner, users."login" AS banuserlogin
    FROM "BloggerBanUsersInfo" AS blogger
    LEFT JOIN "Blogs" AS blogs
    ON blogs."id" = blogger."blogId"
    LEFT JOIN "Users" AS users
    ON users."id" = blogger."banUserId"
    WHERE blogger."blogId" = '${blogId}'
    AND blogger."banUserId" = '${banUserId}'`,
    );
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
    const skip = getSkipNumber(pageNumber, pageSize);
    const users = await this.dataSource.query(
      `SELECT blogger.*, blogs."userId" AS blogowner, users."login" AS banuserlogin
    FROM "BloggerBanUsersInfo" AS blogger
    LEFT JOIN "Blogs" AS blogs
    ON blogs."id" = blogger."blogId"
    LEFT JOIN "Users" AS users
    ON users."id" = blogger."banUserId"
    WHERE blogger."blogId" = '${blogId}'
    AND users."login" = '${searchLoginTerm}'
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT ${pageSize} OFFSET ${skip}`,
    );
    const totalCount = await this.dataSource.query(
      `SELECT blogger.*, blogs."userId" AS blogowner, users."login" AS banuserlogin
    FROM "BloggerBanUsersInfo" AS blogger
    LEFT JOIN "Blogs" AS blogs
    ON blogs."id" = blogger."blogId"
    LEFT JOIN "Users" AS users
    ON users."id" = blogger."banUserId"
    WHERE blogger."blogId" = '${blogId}'
    AND users."login" = '${searchLoginTerm}'`,
    );
    const items = users.map((u) => ({
      id: u.banUserId,
      login: u.banuserlogin,
      banInfo: {
        isBanned: u.isBanned,
        banDate: u.banDate,
        banReason: u.banReason,
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
    const skip = getSkipNumber(pageNumber, pageSize);
    const users = await this.dataSource.query(
      `SELECT * 
    FROM "Users"
    WHERE "login" LIKE '%${searchLoginTerm}%'
    OR "email" LIKE '%${searchEmailTerm}%'
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT ${pageSize} OFFSET ${skip}`,
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
