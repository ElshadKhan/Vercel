import { Injectable } from '@nestjs/common';
import {UsersRepository} from "./users.repository";
import {_generateHash} from "../helpers/helpFunctions";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    // getUsers(term: string) {
    //     return this.usersRepository.getUsers(term);
    // }
    // getUser(userId: string) {
    //     return this.usersRepository.getUser(userId);
    // }
    async createUser(inputModel: CreateUserInputModelType) {
        // const passwordSalt = await bcrypt.genSalt(4)
        // const passwordHash = await _generateHash(inputModel.password, passwordSalt)
        const newUser = new UserAccount(
            String(+new Date()),
            inputModel.login,
            inputModel.password,
            inputModel.email,
            new Date().toISOString(),
        );
        this.usersRepository.createUser(newUser);
        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt,
        }
    }
    deleteUser(userId: string) {
        return this.usersRepository.deleteUser(userId);
    }
    // updateUser(userId: string, name: string, childrenCount: number) {
    //     return this.usersRepository.updateUser(userId, name, childrenCount);
    // }
}

export class UserAccount  {
    constructor(public id: string,
                public password: string,
                public login: string,
                public email: string,
                public createdAt: string,) {
    }

}

export class UserAccountDBType  {
    constructor(public id: string,
                public accountData: UsersAccountDataType,
                public emailConfirmation: EmailConfirmationType,
                public passwordConfirmation: PasswordConfirmationType,) {
    }

}
export type UsersAccountDataType = {
    login: string
    email: string
    passwordHash: string
    passwordSalt: string
    createdAt: string
}
export type EmailConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}
export type PasswordConfirmationType = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export class UsersBusinessType  {
    constructor(public pagesCount: number,
                public page: number,
                public pageSize: number,
                public totalCount: number,
                public items: Array<UserDto>) {
    }

}

export type UserDto = {
    id: string
    login: string
    email: string
    createdAt: string
}

export type CreateUserInputModelType = {
    password: string
    login: string
    email: string
}

// export type QueryUserType = {
//     searchLoginTerm: string
//     searchEmailTerm: string
//     pageNumber: number
//     pageSize: number
//     sortBy: string
//     sortDirection: SortDirection
// }