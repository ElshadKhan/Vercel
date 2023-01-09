import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserAccountDBType } from '../domain/dto/user.account.dto';

export class SqlUsersRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async create(user: UserAccountDBType) {
    return this.dataSource.toString();
  }
}
