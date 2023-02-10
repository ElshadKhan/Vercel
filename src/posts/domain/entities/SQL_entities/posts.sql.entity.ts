import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';
import { BlogSql } from '../../../../blogs/domain/entities/SQL_entities/blogs.sql.entity';

@Entity()
export class PostSql {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => UserSql)
  user: UserSql;

  @Column()
  userId: string;

  @ManyToOne(() => BlogSql)
  blog: BlogSql;

  @Column()
  blogId: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column({ default: false })
  isBanned: boolean;
}
