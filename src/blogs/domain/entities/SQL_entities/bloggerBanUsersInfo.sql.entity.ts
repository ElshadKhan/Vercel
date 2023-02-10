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
  blogId: string;

  @OneToOne(() => UserSql)
  @JoinColumn()
  banUser: UserSql;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: null })
  banReason: string;

  @Column({ default: null })
  banDate: Date;
}
