import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { UsersQueryRepository } from '../../users/infrastructure/users.queryRepository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersQueryRepository: UsersQueryRepository) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string): Promise<any> {
    const user = await this.usersQueryRepository.findUserByLoginOrEmail(
      loginOrEmail,
    );
    if (!user || user.banInfo.isBanned) return false;
    const isValid = await bcrypt.compare(
      password,
      user.accountData.passwordHash,
    );
    if (!isValid) return false;
    return user;
  }
}
