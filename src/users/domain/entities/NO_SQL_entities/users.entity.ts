import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  BanInfoType,
  EmailConfirmationType,
  PasswordConfirmationType,
  UsersAccountDataType,
} from '../../dto/user.account.dto';

@Schema({ id: false })
export class UsersBanInfoTypeData {
  @Prop()
  isBanned: boolean;

  @Prop()
  banDate: string;

  @Prop()
  banReason: string;
}

export const UsersBanInfoTypeDataSchema =
  SchemaFactory.createForClass(UsersBanInfoTypeData);

@Schema({ id: false })
export class UsersAccountData {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  createdAt: string;
}

export const UsersAccountDataSchema =
  SchemaFactory.createForClass(UsersAccountData);

@Schema({ id: false })
export class UsersEmailConfirmationData {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

export const UsersEmailConfirmationDataSchema = SchemaFactory.createForClass(
  UsersEmailConfirmationData,
);

@Schema({ id: false })
export class UsersPasswordConfirmationData {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

export const UsersPasswordConfirmationDataSchema = SchemaFactory.createForClass(
  UsersPasswordConfirmationData,
);

export type UserDbTypeWithId = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ type: UsersAccountDataSchema })
  accountData: UsersAccountDataType;

  @Prop({ type: UsersEmailConfirmationDataSchema })
  emailConfirmation: EmailConfirmationType;

  @Prop({ type: UsersPasswordConfirmationDataSchema })
  passwordConfirmation: PasswordConfirmationType;

  @Prop({ type: UsersBanInfoTypeDataSchema })
  banInfo: BanInfoType;
}

export const UserSchema = SchemaFactory.createForClass(User);
