import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserSql } from '../../../../users/domain/entities/SQL_entities/users.sql.entity';

@Entity()
export class PasswordConfirmationSql {
  @OneToOne(() => UserSql)
  @JoinColumn()
  user: UserSql;

  @PrimaryColumn()
  userId: string;

  @Column()
  confirmationCode: string;

  @Column()
  expirationDate: Date;

  @Column()
  isConfirmed: boolean;
}
