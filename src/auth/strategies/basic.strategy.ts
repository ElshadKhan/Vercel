import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password): Promise<boolean> => {
    if (
      this.configService.get<string>('SA_BASIC_USERNAME') === username &&
      this.configService.get<string>('SA_BASIC_PASSWORD') === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
