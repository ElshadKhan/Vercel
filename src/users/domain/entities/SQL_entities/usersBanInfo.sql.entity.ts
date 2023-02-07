import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from './users.sql.entity';

@Entity()
export class UserBanInfoSql {
  @OneToOne(() => UserSql)
  @JoinColumn()
  user: UserSql;

  @PrimaryColumn()
  userId: number;

  @Column()
  isBanned: boolean;

  @Column()
  banReason: string;

  @Column()
  banDate: Date;
}
