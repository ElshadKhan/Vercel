import { User, UserDbType } from './entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { getPagesCounts, getSkipNumber } from '../helpers/helpFunctions';
import { UsersBusinessType } from './dto/user-business.dto';
import { UserAccountDBType } from './dto/user.db';
import { QueryValidationType } from '../middleware/queryValidation';

@Injectable()
export class UsersQueryRepository {
  @InjectModel(User.name) private userModel: Model<UserDbType>;

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
    const items = users.map((u) => ({
      id: u.id,
      login: u.accountData.login,
      email: u.accountData.email,
      createdAt: u.accountData.createdAt,
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

  async getUser(userId: string): Promise<UserAccountDBType | null> {
    return await this.userModel.findOne({ id: userId });
  }
}
