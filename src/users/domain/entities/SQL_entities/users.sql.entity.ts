import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserSql {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  createdAt: Date;
}
