import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { BlogSql } from './blogs.sql.entity';

@Entity()
export class BlogBanInfoSql {
  @OneToOne(() => BlogSql)
  @JoinColumn()
  blog: BlogSql;

  @PrimaryColumn()
  blogId: string;

  @Column({ default: false })
  isBanned: boolean;

  @Column({ default: null })
  banDate: Date;
}
