import { User, UserDbTypeWithId } from '../domain/entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { getPagesCounts, getSkipNumber } from '../../helpers/helpFunctions';
import { UsersBusinessType } from './dto/userBusinessDto';
import { UserAccountDBType } from '../domain/dto/user.account.dto';
import { QueryValidationType } from '../../helpers/middleware/queryValidation';
import { LoginUserDto } from '../../auth/domain/dto/login.dto';

@Injectable({ scope: Scope.DEFAULT })
export class UsersQueryRepository {
  @InjectModel(User.name) private userModel: Model<UserDbTypeWithId>;

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

  async getUsers({
    searchLoginTerm,
    searchEmailTerm,
    pageNumber,
    pageSize,
    sortBy,
    sortDirection,
  }: QueryValidationType): Promise<UsersBusinessType> {
    const users = await this.userModel
      .find({
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
      })
      .sort([[`accountData.${sortBy}`, sortDirection]])
      .skip(getSkipNumber(pageNumber, pageSize))
      .limit(pageSize)
      .lean();
    const totalCountUsers = await this.userModel
      .find({
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
      })
      .count();
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

  async findBanUser(userId: string): Promise<UserAccountDBType | null> {
    return await this.userModel.findOne({
      id: userId,
      'banInfo.isBanned': false,
    });
  }

  async getUser(userId: string): Promise<UserAccountDBType | null> {
    return await this.userModel.findOne({
      id: userId,
    });
  }
}
