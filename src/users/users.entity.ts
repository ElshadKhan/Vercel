import {Prop, raw, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';
import {
    EmailConfirmationType,
    PasswordConfirmationType,
    UserAccountDBType,
    UsersAccountDataType
} from "./users.service";

@Schema({id: false})
export class UsersAccountData {
    @Prop({required: true})
    login: string

    @Prop({required: true})
    email: string
    @Prop({required: true})
    passwordHash: string

    @Prop({required: true})
    passwordSalt: string

    @Prop({required: true})
    createdAt: string
}

const UsersAccountDataSchema = SchemaFactory.createForClass(UsersAccountData);

@Schema({id: false})
export class UsersEmailConfirmationData {
    @Prop({required: true})
    confirmationCode: string

    @Prop({required: true})
    expirationDate: Date

    @Prop({required: true})
    isConfirmed: boolean
}

const UsersEmailConfirmationDataSchema = SchemaFactory.createForClass(UsersEmailConfirmationData);

@Schema({id: false})
export class UsersPasswordConfirmationData {
    @Prop({required: true})
    confirmationCode: string

    @Prop({required: true})
    expirationDate: Date

    @Prop({required: true})
    isConfirmed: boolean
}

const UsersPasswordConfirmationDataSchema = SchemaFactory.createForClass(UsersPasswordConfirmationData);

export type UserDbType = HydratedDocument<User>;

@Schema({
    // _id: false,
    id: false
})
export class User {

    @Prop({required: true, unique: true})
    id: string;

    @Prop({type: UsersAccountDataSchema})
    accountData: UsersAccountDataType

    @Prop({type: UsersEmailConfirmationDataSchema})
    emailConfirmation: EmailConfirmationType

    @Prop({type: UsersPasswordConfirmationDataSchema})
    passwordConfirmation: PasswordConfirmationType
}

export const UserSchema = SchemaFactory.createForClass(User);