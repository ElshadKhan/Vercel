import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';
import { BlogSql } from '../../../../blogs/domain/entities/SQL_entities/blogs.sql.entity';

@Entity()
export class PostSql {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserSql)
  user: UserSql;

  @Column()
  userId: number;

  @ManyToOne(() => BlogSql)
  blog: BlogSql;

  @Column()
  blogId: number;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column()
  isBanned: boolean;
}
