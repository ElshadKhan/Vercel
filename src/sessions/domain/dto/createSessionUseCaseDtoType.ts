export class CreateSessionUseCaseDtoType {
  constructor(
    public userId: string,
    public ip: string,
    public deviceName: string,
  ) {}
}
