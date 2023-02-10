import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from './users.sql.entity';

@Entity()
export class UserBanInfoSql {
  @OneToOne(() => UserSql)
  @JoinColumn()
  user: UserSql;

  @PrimaryColumn()
  userId: string;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: null })
  banReason: string;

  @Column({ default: null })
  banDate: Date;
}
