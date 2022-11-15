export class CreateUserDto {
  constructor(
    public password: string,
    public login: string,
    public email: string,
  ) {}
}
