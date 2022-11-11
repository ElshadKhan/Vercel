import {User, UserDbType} from "./users.entity";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UsersQueryRepository {
    @InjectModel(User.name) private userModel: Model<UserDbType>
    getUsers(term): object {
        return [{id: 1, name: 'Elshad',  childrenCount: 1}, {id: 2, name: 'Kamila',  childrenCount: 1}].filter(u => !term || u.name.indexOf(term) > -1);
    }
    getUser(userId: string): object {
        return [{id: 1, name: 'Elshad',  childrenCount: 1}, {id: 2, name: 'Kamila',  childrenCount: 1}].find(u => u.id === +userId);
    }
}