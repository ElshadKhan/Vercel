import { SortDirection } from '../../middleware/queryValidation';

export class UserAccountDBType {
  constructor(
    public id: string,
    public accountData: UsersAccountDataType,
    public emailConfirmation: EmailConfirmationType,
    public passwordConfirmation: PasswordConfirmationType,
  ) {}
}

export class UsersAccountDataType {
  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
    public passwordSalt: string,
    public createdAt: string,
  ) {}
}

export class EmailConfirmationType {
  constructor(
    public confirmationCode: string,
    public expirationDate: Date,
    public isConfirmed: boolean,
  ) {}
}

export class PasswordConfirmationType {
  constructor(
    public confirmationCode: string,
    public expirationDate: Date,
    public isConfirmed: boolean,
  ) {}
}

export type UserDto = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
export type QueryUserType = {
  searchLoginTerm: string;
  searchEmailTerm: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
};

export class UsersBusinessType {
  constructor(
    public pagesCount: number,
    public page: number,
    public pageSize: number,
    public totalCount: number,
    public items: Array<UserDto>,
  ) {}
}

export type CreateUserInputModelType = {
  password: string;
  login: string;
  email: string;
};
