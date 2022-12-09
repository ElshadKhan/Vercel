import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { UsersQueryRepository } from '../../users/infrastructure/users.queryRepository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userQueryRepository: UsersQueryRepository) {
    super({ usernameField: 'loginOrEmail', passReqToCallback: true });
  }

  async validate(LoginOrEmail: string, password: string): Promise<any> {
    const user = await this.userQueryRepository.findUserByLoginOrEmail(
      LoginOrEmail,
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
