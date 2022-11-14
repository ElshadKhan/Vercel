import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  constructor(private configService: ConfigService) {}

  private saltRounds = +this.configService.get('SALT_ROUNDS');

  private async generateSalt(): Promise<string> {
    return bcrypt.genSalt(this.saltRounds);
  }

  private async generateHash(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async generateSaltAndHash(password: string) {
    const salt = await this.generateSalt();
    const hash = await this.generateHash(password, salt);
    return { passwordSalt: salt, passwordHash: hash };
  }

  async comparePasswords(password: string, passwordFromDb: string) {
    const result = await bcrypt.compare(password, passwordFromDb);
    if (!result) throw new UnauthorizedException();
    return;
  }
}
