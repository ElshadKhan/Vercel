import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { BlogSql } from './blogs.sql.entity';

@Entity()
export class BlogBanInfoSql {
  @OneToOne(() => BlogSql)
  @JoinColumn()
  blog: BlogSql;

  @PrimaryColumn()
  blogId: number;

  @Column()
  isBanned: boolean;

  @Column()
  banDate: Date;
}
