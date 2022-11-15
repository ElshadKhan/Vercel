import { User, UserDbType } from './entities/users.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserAccountDBType } from './dto/user.db';

@Injectable()
export class UsersRepository {
  @InjectModel(User.name) private userModel: Model<UserDbType>;

  async create(user: UserAccountDBType) {
    return this.userModel.create(user);
  }

  async delete(id: string) {
    const result = await this.userModel.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async deleteAll() {
    return await this.userModel.deleteMany({});
  }
}
