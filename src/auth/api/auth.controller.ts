import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUserDto } from '../domain/dto/login.dto';
import { CreateUserDto } from '../../users/api/dto/create-user.dto';
import { SessionsService } from '../../sessions/application/sessions.service';
import { JwtService } from '../application/jwt-service';
import { SessionsRepository } from '../../sessions/infrastructure/sessionsRepository';
import { ResendingDto } from '../domain/dto/resending.dto';
import { ConfirmationCodeDto } from '../domain/dto/confirmation.code.dto';
import { PasswordConfirmationCodeDto } from '../domain/dto/password.confirmation.code.dto';
import { CustomThrottlerGuard } from '../guards/custom.throttler.guard';
import { RefreshTokenGuard } from '../guards/refresh.token.guard';
import { UsersQueryRepository } from '../../users/infrastructure/users.queryRepository';
import { CurrentUserId } from '../current-user-id.param.decorator';
import { BearerAuthGuard } from '../guards/bearer.auth.guard';
import { CheckCredentialsCommand } from '../application/use-cases/check-credentials-use-case';
import { EmailResendingCommand } from '../application/use-cases/email-resending-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { RegistrationUserCommand } from '../application/use-cases/registration-user-use-case';
import { PasswordResendingCommand } from '../application/use-cases/password-resending-use-case';
import { EmailConfirmationCommand } from '../application/use-cases/email-confirmation-use-case';
import { PasswordConfirmationCommand } from '../application/use-cases/password-confirmation-use-case';

@Controller('auth')
export class AuthController {
  constructor(
    // private authService: AuthService,
    private commandBus: CommandBus,
    private sessionsService: SessionsService,
    private sessionsRepository: SessionsRepository,
    private usersQueryRepository: UsersQueryRepository,
    private jwtService: JwtService,
  ) {}

  @Get('/me')
  @UseGuards(BearerAuthGuard)
  async findAuthUser(@CurrentUserId() currentUserId: string) {
    const user = await this.usersQueryRepository.getUser(currentUserId);
    return {
      email: user.accountData.email,
      login: user.accountData.login,
      userId: user.id,
    };
  }

  @UseGuards(CustomThrottlerGuard)
  @Post('/registration')
  @HttpCode(204)
  async registration(@Body() inputModel: CreateUserDto) {
    const findUserByEmail =
      await this.usersQueryRepository.findUserByLoginOrEmail(inputModel.email);
    if (findUserByEmail) {
      throw new BadRequestException([
        {
          message: 'Email already exists',
          field: 'email',
        },
      ]);
    }

    const findUserByLogin =
      await this.usersQueryRepository.findUserByLoginOrEmail(inputModel.login);
    if (findUserByLogin) {
      throw new BadRequestException([
        {
          message: 'Login already exists',
          field: 'login',
        },
      ]);
    }
    return await this.commandBus.execute(
      new RegistrationUserCommand(inputModel),
    );
  }

  @UseGuards(CustomThrottlerGuard)
  @Post('/login')
  async login(@Body() inputModel: LoginUserDto, @Req() req, @Res() res) {
    const user = await this.commandBus.execute(
      new CheckCredentialsCommand(inputModel),
    );
    if (!user || user.banInfo.isBanned) throw new UnauthorizedException();
    const tokens = await this.sessionsService.createSession(
      user.id,
      req.ip,
      req.headers['user-agent'],
    );
    res
      .cookie('refreshToken', tokens.refreshToken, {
        maxAge: 200000000,
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .send({
        accessToken: tokens.accessToken,
      });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async resendingRefreshTokens(
    @CurrentUserId() currentUserId: string,
    @Req() req,
    @Res() res,
  ) {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    const tokens = await this.jwtService.createJWTTokens(
      currentUserId,
      payload.deviceId,
    );
    const newLastActiveDate = await this.jwtService.getUserIdByRefreshToken(
      tokens.refreshToken.split(' ')[0],
    );
    const lastActiveDate = new Date(newLastActiveDate.iat * 1000).toISOString();
    await this.sessionsService.updateSession(
      payload.userId,
      payload.deviceId,
      lastActiveDate,
    );

    res
      .cookie('refreshToken', tokens.refreshToken, {
        maxAge: 2000000,
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .send({
        accessToken: tokens.accessToken,
      });
  }

  @UseGuards(RefreshTokenGuard)
  @Post('/logout')
  @HttpCode(204)
  async logoutUser(@Req() req) {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    return await this.sessionsRepository.deleteSessionsByDeviceId(
      payload.userId,
      payload.deviceId,
    );
  }

  @UseGuards(CustomThrottlerGuard)
  @Post('/registration-confirmation')
  @HttpCode(204)
  async confirmationEmail(@Body() inputModel: ConfirmationCodeDto) {
    const result = await this.commandBus.execute(
      new EmailConfirmationCommand(inputModel.code),
    );
    if (!result) {
      throw new BadRequestException([
        {
          message: 'Code already incorrect',
          field: 'code',
        },
      ]);
    }
    return result;
  }

  @UseGuards(CustomThrottlerGuard)
  @Post('/new-password')
  @HttpCode(204)
  async confirmationPassword(@Body() inputModel: PasswordConfirmationCodeDto) {
    const result = await this.commandBus.execute(
      new PasswordConfirmationCommand(inputModel),
    );
    if (!result) {
      throw new BadRequestException([
        {
          message: 'recoveryCode already incorrect',
          field: 'recoveryCode',
        },
      ]);
    }
    return result;
  }

  @UseGuards(CustomThrottlerGuard)
  @Post('/registration-email-resending')
  @HttpCode(204)
  async emailResending(@Body() inputModel: ResendingDto) {
    const result = await this.commandBus.execute(
      new EmailResendingCommand(inputModel.email),
    );
    if (!result) {
      throw new BadRequestException([
        {
          message: 'Email already incorrect',
          field: 'email',
        },
      ]);
    }
    return result;
  }

  @UseGuards(CustomThrottlerGuard)
  @Post('/password-recovery')
  @HttpCode(204)
  async passwordResending(@Body() inputModel: ResendingDto) {
    const result = await this.commandBus.execute(
      new PasswordResendingCommand(inputModel.email),
    );
    if (!result) {
      throw new BadRequestException([
        {
          message: 'Email already incorrect',
          field: 'email',
        },
      ]);
    }
    return result;
  }
}
