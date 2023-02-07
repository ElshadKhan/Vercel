import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';
import { PostSql } from '../../../../posts/domain/entities/SQL_entities/posts.sql.entity';
import { LikeStatusEnam } from '../../dto/like-enam.dto';

@Entity()
export class PostLikeSql {
  @ManyToOne(() => UserSql)
  user: UserSql;

  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => PostSql)
  post: PostSql;

  @Column()
  postId: number;

  @Column({
    type: 'enum',
    enum: LikeStatusEnam,
    default: [LikeStatusEnam.None],
  })
  type: LikeStatusEnam;

  @Column()
  createdAt: Date;

  @Column()
  isBanned: boolean;
}
