import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';

@Entity()
export class BlogSql {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  websiteUrl: string;

  @Column()
  createdAt: Date;

  @OneToOne(() => UserSql)
  @JoinColumn()
  user: UserSql;

  @Column()
  userId: string;
}
