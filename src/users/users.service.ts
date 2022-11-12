import { Injectable } from '@nestjs/common';
import {UsersRepository} from "./users.repository";
import {v4 as uuidv4} from "uuid";
import { add } from 'date-fns'
import {ConfigService} from "@nestjs/config";
import {PasswordService} from "../password/password.service";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository,
                private configService: ConfigService,
                private passwordService: PasswordService
    ) {
    }
    private jwtSecret = this.configService.get<string>('JWT_SECRET')
    // getUsers(term: string) {
    //     return this.usersRepository.getUsers(term);
    // }
    // getUser(userId: string) {
    //     return this.usersRepository.getUser(userId);
    // }
    async createUser(inputModel: CreateUserInputModelType) {
        const {passwordSalt, passwordHash} = await this.passwordService.generateSaltAndHash(inputModel.password)
        const newUser = new UserAccountDBType(
            String(+new Date()),
            {
                login: inputModel.login,
                email: inputModel.email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString()
            }, {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 1, minutes: 1}),
                isConfirmed: false
            }, {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {hours: 2, minutes: 2}),
                isConfirmed: false
            })
        await this.usersRepository.createUser(newUser);
        return {
            id: newUser.id,
            login: newUser.accountData.login,
            email: newUser.accountData.email,
            createdAt: newUser.accountData.createdAt
        }
    }
    deleteUser(userId: string) {
        return this.usersRepository.deleteUser(userId);
    }
    // updateUser(userId: string, name: string, childrenCount: number) {
    //     return this.usersRepository.updateUser(userId, name, childrenCount);
    // }
}

export class UserAccountDBType  {
    constructor(public id: string,
                public accountData: UsersAccountDataType,
                public emailConfirmation: EmailConfirmationType,
                public passwordConfirmation: PasswordConfirmationType,) {
    }

}
export class UsersAccountDataType {
    constructor(public login: string,
                public email: string,
                public passwordHash: string,
                public passwordSalt: string,
                public createdAt: string) {
    }
}
export class EmailConfirmationType {
    constructor(public confirmationCode: string,
    public expirationDate: Date,
    public isConfirmed: boolean) {
    }
}
export class PasswordConfirmationType {
    constructor(public confirmationCode: string,
                public expirationDate: Date,
                public isConfirmed: boolean) {
    }
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