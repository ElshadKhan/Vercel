import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';
import { PostSql } from '../../../../posts/domain/entities/SQL_entities/posts.sql.entity';

@Entity()
export class CommentSql {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserSql)
  user: UserSql;

  @Column()
  userId: number;

  @ManyToOne(() => PostSql)
  post: PostSql;

  @Column()
  postId: number;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @Column()
  isBanned: boolean;
}
