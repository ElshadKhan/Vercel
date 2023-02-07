import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { BlogSql } from './blogs.sql.entity';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';

@Entity()
export class BloggerBanUsersInfoSql {
  @ManyToOne(() => BlogSql)
  @JoinColumn()
  blog: BlogSql;

  @PrimaryColumn()
  blogId: number;

  @OneToOne(() => UserSql)
  @JoinColumn()
  banUser: UserSql;

  @Column()
  isBanned: boolean;

  @Column()
  banReason: string;

  @Column()
  banDate: Date;
}
