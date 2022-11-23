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
