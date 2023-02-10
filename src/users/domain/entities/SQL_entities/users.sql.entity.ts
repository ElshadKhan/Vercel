import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserSql {
  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Column({ unique: true, type: 'character varying' })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  createdAt: Date;
}
