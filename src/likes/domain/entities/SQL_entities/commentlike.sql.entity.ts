import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';
import { LikeStatusEnam } from '../../dto/like-enam.dto';
import { CommentSql } from '../../../../comments/domain/entities/SQL_entities/comments.sql.entity';

@Entity()
export class CommentLikeSql {
  @ManyToOne(() => UserSql)
  user: UserSql;

  @PrimaryColumn()
  userId: string;

  @ManyToOne(() => CommentSql)
  comment: CommentSql;

  @Column()
  commentId: string;

  @Column({
    type: 'enum',
    enum: LikeStatusEnam,
    default: [LikeStatusEnam.None],
  })
  type: LikeStatusEnam;

  @Column()
  createdAt: Date;

  @Column({ default: false })
  isBanned: boolean;
}
