import {
  User,
  UserDbTypeWithId,
} from '../domain/entities/NO_SQL_entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserAccountDBType } from '../domain/dto/user.account.dto';
import {
  BloggerUsersBan,
  BloggerUsersBanDocument,
} from '../domain/entities/NO_SQL_entities/blogger.users.blogs.ban.entity';
import { BanUsersFactory } from '../api/dto/update-user-banStatus-dto';
import { BanBloggerUsersModel } from '../api/dto/ban-bloger-users-input-dto';

@Injectable({ scope: Scope.DEFAULT })
export class SqlUsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(user: UserAccountDBType) {
    await this.dataSource.query(`INSERT INTO "Users"(
    "id", "login", "email", "passwordHash", "createdAt")
    VALUES ('${user.id}', '${user.accountData.login}', '${user.accountData.email}', '${user.accountData.passwordHash}', '${user.accountData.createdAt}')`);
    await this.dataSource.query(`INSERT INTO public."EmailConfirmation"(
    "userId", "confirmationCode", "expirationDate", "isConfirmed")
    VALUES ('${user.id}', '${user.emailConfirmation.confirmationCode}', '${user.emailConfirmation.expirationDate}', '${user.emailConfirmation.isConfirmed}')`);
    await this.dataSource.query(`INSERT INTO public."PasswordConfirmation"(
    "userId", "confirmationCode", "expirationDate", "isConfirmed")
    VALUES ('${user.id}', '${user.passwordConfirmation.confirmationCode}', '${user.passwordConfirmation.expirationDate}', '${user.passwordConfirmation.isConfirmed}')`);
    await this.dataSource.query(`INSERT INTO public."UsersBanInfo"(
    "userId", "isBanned", "banReason", "banDate")
    VALUES ('${user.id}', '${user.banInfo.isBanned}', ${user.banInfo.banReason}, ${user.banInfo.banDate})`);
    return user;
  }

  async updateEmailConfirmation(id: string) {
    const result = await this.dataSource.query(`UPDATE "EmailConfirmation"
    SET "isConfirmed" = true
    WHERE "userId" = '${id}'`);
    console.log('UPDATE emailIsConfirmed', result[1] === 1);
    return result[1] === 1;
  }
  async updatePasswordConfirmation(id: string) {
    const result = await this.dataSource.query(`UPDATE "PasswordConfirmation"
    SET "isConfirmed" = true
    WHERE "userId" = '${id}'`);
    console.log('UPDATE passwordIsConfirmed', result[1] === 1);
    return result[1] === 1;
  }
  async updateEmailResendingCode(id: string, code: string) {
    const result = await this.dataSource.query(`UPDATE "EmailConfirmation"
    SET "confirmationCode" = '${code}'
    WHERE "userId" = '${id}'`);
    console.log('UPDATE emailConfirmationCode', result[1] === 1);
    return result[1] === 1;
  }
  async updatePasswordResendingCode(id: string, code: string) {
    const result = await this.dataSource.query(`UPDATE "PasswordConfirmation"
    SET "confirmationCode" = '${code}'
    WHERE "userId" = '${id}'`);
    console.log('UPDATE passwordConfirmationCode', result[1] === 1);
    return result[1] === 1;
  }
  async updatePassword(id: string, passwordHash: string) {
    const result = await this.dataSource.query(`UPDATE "Users"
    SET "passwordHash" = '${passwordHash}'
    WHERE "id" = '${id}'`);
    console.log('Update passwordHashResults', result[1] === 1);
    return result[1] === 1;
  }

  async banBloggerUsers(user: BanBloggerUsersModel) {
    const result = await this.dataSource.query(
      `INSERT INTO "BloggerBanUsersInfo"("isBanned", "banDate", "banReason", "blogId", "banUserId")
    VALUES ('${user.banInfo.isBanned}', '${user.banInfo.banDate}', '${user.banInfo.banReason}', '${user.blogId}', '${user.banUserId}')`,
    );
    console.log('Create BloggerBanUser result', result);
    return user;
  }

  async unbanBloggerUsers(banUserId: string, blogId: string) {
    const result = await this.dataSource
      .query(`DELETE FROM "BloggerBanUsersInfo"
    WHERE "blogId" = '${blogId}'
    AND "banUserId" = '${banUserId}'`);
    console.log('Delete unbanned userResult', result[1] === 1);
    return result[1] === 1;
  }

  async updateUsers(model: BanUsersFactory) {
    if (model.isBanned) {
      const result = await this.dataSource.query(`UPDATE "UsersBanInfo"
    SET "isBanned" = '${model.isBanned}', "banReason" = '${model.banReason}', "banDate" = '${model.banDate}'
    WHERE "userId" = '${model.id}'`);
      console.log('Update UserBanInfoResult', result[1] === 1);
      return result[1] === 1;
    } else {
      const result = await this.dataSource.query(`UPDATE "UsersBanInfo"
    SET "isBanned" = '${model.isBanned}', "banReason" = ${model.banReason}, "banDate" = ${model.banDate}
    WHERE "userId" = '${model.id}'`);
      console.log('Update UserBanInfoResult', result[1] === 1);
      return result[1] === 1;
    }
  }

  async delete(id: string) {
    console.log('id', id);
    const result = await this.dataSource.query(
      `DELETE FROM "Users"
	WHERE "id" = '${id}'`,
    );
    return result[1] === 1;
  }

  async deleteAll() {
    return await this.dataSource.query(`DELETE FROM "Users"`);
  }
}
