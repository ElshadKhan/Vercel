import {User, UserDbType} from "./users.entity";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";
import {UserAccountDBType} from "./users.service";

@Injectable()
export class UsersRepository {
    @InjectModel(User.name) private userModel: Model<UserDbType>

    async createUser(user: UserAccountDBType) {
        return this.userModel.create(user)
    }

    async deleteUser(id: string) {
        const result = await this.userModel.deleteOne({id})
        return result.deletedCount === 1
    }

    async deleteAllUser() {
        return await this.userModel.deleteMany({})
    }

}