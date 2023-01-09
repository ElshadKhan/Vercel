import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

export class SqlUsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getUsersForSa() {
    console.log('1');
    return this.dataSource.toString();
  }
}
