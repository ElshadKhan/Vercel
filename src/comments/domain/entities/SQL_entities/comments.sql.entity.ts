import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';
import { PostSql } from '../../../../posts/domain/entities/SQL_entities/posts.sql.entity';

@Entity()
export class CommentSql {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => UserSql)
  user: UserSql;

  @Column()
  userId: string;

  @ManyToOne(() => PostSql)
  post: PostSql;

  @Column()
  postId: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column({ default: false })
  isBanned: boolean;
}
