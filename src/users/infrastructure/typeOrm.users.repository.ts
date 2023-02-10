import { Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UserAccountDBType } from '../domain/dto/user.account.dto';
import { BanUsersFactory } from '../api/dto/update-user-banStatus-dto';
import { BanBloggerUsersModel } from '../api/dto/ban-bloger-users-input-dto';
import { UserSql } from '../domain/entities/SQL_entities/users.sql.entity';
import { EmailConfirmationSql } from '../../auth/domain/entities/SQL_entities/email.sql.entity';
import { PasswordConfirmationSql } from '../../auth/domain/entities/SQL_entities/password.sql.entity';
import { UserBanInfoSql } from '../domain/entities/SQL_entities/usersBanInfo.sql.entity';

@Injectable({ scope: Scope.DEFAULT })
export class TypeOrmUsersRepository {
  constructor(
    @InjectRepository(UserSql) private usersSqlRepository: Repository<UserSql>,
    @InjectRepository(UserBanInfoSql)
    private userBanInfoSqlRepository: Repository<UserBanInfoSql>,
    @InjectRepository(EmailConfirmationSql)
    private emailConfirmationSqlRepository: Repository<EmailConfirmationSql>,
    @InjectRepository(PasswordConfirmationSql)
    private passwordConfirmationSqlRepository: Repository<PasswordConfirmationSql>,
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async create(user: UserAccountDBType) {
    const newUser = {
      id: user.id,
      login: user.accountData.login,
      email: user.accountData.email,
      passwordHash: user.accountData.passwordHash,
      createdAt: new Date(user.accountData.createdAt),
    };

    await this.usersSqlRepository.save(newUser);

    const newUserBanInfo = {
      userId: user.id,
      isBanned: user.banInfo.isBanned,
      banReason: user.banInfo.banReason,
      banDate: user.banInfo.banDate,
    };

    await this.userBanInfoSqlRepository.save(newUserBanInfo);

    const emailConfirmationInfo = {
      userId: user.id,
      confirmationCode: user.emailConfirmation.confirmationCode,
      expirationDate: user.emailConfirmation.expirationDate,
      isConfirmed: user.emailConfirmation.isConfirmed,
    };

    await this.emailConfirmationSqlRepository.save(emailConfirmationInfo);

    const passwordConfirmationInfo = {
      userId: user.id,
      confirmationCode: user.passwordConfirmation.confirmationCode,
      expirationDate: user.passwordConfirmation.expirationDate,
      isConfirmed: user.passwordConfirmation.isConfirmed,
    };

    await this.passwordConfirmationSqlRepository.save(passwordConfirmationInfo);

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
