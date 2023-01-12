import { User, UserDbTypeWithId } from '../domain/entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Scope } from '@nestjs/common';
import { UserAccountDBType } from '../domain/dto/user.account.dto';
import {
  BloggerUsersBan,
  BloggerUsersBanDocument,
} from '../domain/entities/blogger.users.blogs.ban.entity';
import { BanUsersFactory } from '../api/dto/update-user-banStatus-dto';
import { BanBloggerUsersModel } from '../api/dto/ban-bloger-users-input-dto';

@Injectable({ scope: Scope.DEFAULT })
export class UsersRepository {
  @InjectModel(User.name) private userModel: Model<UserDbTypeWithId>;
  @InjectModel(BloggerUsersBan.name)
  private bloggerUsersBanModel: Model<BloggerUsersBanDocument>;

  async create(user: UserAccountDBType) {
    return this.userModel.create(user);
  }

  async updateEmailConfirmation(id: string) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }
  async updatePasswordConfirmation(id: string) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'passwordConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }
  async updateEmailResendingCode(id: string, code: string) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'emailConfirmation.confirmationCode': code } },
    );
    return result.modifiedCount === 1;
  }
  async updatePasswordResendingCode(id: string, code: string) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'passwordConfirmation.confirmationCode': code } },
    );
    return result.modifiedCount === 1;
  }
  async updatePassword(id: string, passwordHash: string) {
    const result = await this.userModel.updateOne(
      { id: id },
      { $set: { 'accountData.passwordHash': passwordHash } },
    );
    return result.modifiedCount === 1;
  }

  async banBloggerUsers(user: BanBloggerUsersModel) {
    const banUsers = await new this.bloggerUsersBanModel(user);
    return banUsers.save();
  }

  async unbanBloggerUsers(banUserId: string, blogId: string) {
    const result = await this.bloggerUsersBanModel.deleteOne({
      banUserId,
      blogId,
    });
    return result.deletedCount === 1;
  }

  async updateUsers(model: BanUsersFactory) {
    const result = await this.userModel.updateOne(
      { id: model.id },
      {
        'banInfo.isBanned': model.isBanned,
        'banInfo.banDate': model.banDate,
        'banInfo.banReason': model.banReason,
      },
    );
    return result.matchedCount === 1;
  }

  async delete(id: string) {
    const result = await this.userModel.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    return await this.userModel.deleteMany({});
  }
}
