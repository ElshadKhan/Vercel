import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';

@Entity()
export class SessionSql {
  @ManyToOne(() => UserSql)
  user: UserSql;

  @PrimaryColumn()
  userId: number;

  @Column()
  deviceId: string;

  @Column()
  ip: string;

  @Column()
  title: string;

  @Column()
  lastActiveDate: Date;

  @Column()
  expiredDate: Date;
}
