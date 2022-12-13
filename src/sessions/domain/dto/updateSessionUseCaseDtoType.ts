export class UpdateSessionUseCaseDtoType {
  constructor(
    public userId: string,
    public deviceId: string,
    public lastActiveDate: string,
  ) {}
}
