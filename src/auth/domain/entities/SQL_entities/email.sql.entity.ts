import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';

@Entity()
export class EmailConfirmationSql {
  @OneToOne(() => UserSql)
  @JoinColumn()
  user: UserSql;

  @PrimaryColumn()
  userId: number;

  @Column()
  confirmationCode: string;

  @Column()
  expirationDate: Date;

  @Column()
  isConfirmed: boolean;
}
