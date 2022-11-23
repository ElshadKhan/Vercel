export class SessionDBType {
  constructor(
    public ip: string,
    public title: string,
    public lastActiveDate: string,
    public expiredDate: string,
    public deviceId: string,
    public userId: string,
  ) {}
}

export class SessionType {
  constructor(
    public ip: string,
    public title: string,
    public lastActiveDate: Date,
    public deviceId: string,
  ) {}
}
