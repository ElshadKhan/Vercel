import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SessionsService } from '../sessions/sessions.service';
import { JwtService } from './application/jwt-service';
import { SessionsRepository } from '../sessions/sessionsRepository';
import { ResendingDto } from './dto/resending.dto';
import { ConfirmationCodeDto } from './dto/confirmation.code.dto';
import { PasswordConfirmationCodeDto } from './dto/password.confirmation.code.dto';
import { BearerAuthGuard } from './guards/bearer.auth.guard';
import { CustomThrottlerGuard } from './guards/custom.throttler.guard';
import { RefreshTokenGuard } from './guards/refresh.token.guard';
import { UsersQueryRepository } from '../users/users.queryRepository';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionsService: SessionsService,
    private sessionsRepository: SessionsRepository,
    private usersQueryRepository: UsersQueryRepository,
    private jwtService: JwtService,
  ) {}

  @Get('/me')
  @UseGuards(BearerAuthGuard)
  findAuthUser(@Req() req) {
    return {
      email: req.user.accountData.email,
      login: req.user.accountData.login,
      userId: req.user.id,
    };
  }
  // @UseGuards(CustomThrottlerGuard)
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
    return await this.authService.registration(inputModel);
  }
  // @UseGuards(CustomThrottlerGuard)
  @Post('/login')
  async login(@Body() inputModel: LoginUserDto, @Req() req, @Res() res) {
    const user = await this.authService.checkCredentials(inputModel);
    if (!user) throw new HttpException({}, 401);

    const tokens = await this.sessionsService.createSession(
      user,
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
  async resendingRefreshTokens(@Req() req, @Res() res) {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    const tokens = await this.jwtService.createJWTTokens(
      req.user,
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
  // @UseGuards(CustomThrottlerGuard)
  @Post('/registration-confirmation')
  @HttpCode(204)
  async confirmationEmail(@Body() inputModel: ConfirmationCodeDto) {
    const result = await this.authService.confirmationEmail(inputModel.code);
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
  // @UseGuards(CustomThrottlerGuard)
  @Post('/new-password')
  @HttpCode(204)
  async confirmationPassword(@Body() inputModel: PasswordConfirmationCodeDto) {
    const result = await this.authService.confirmationPassword(
      inputModel.newPassword,
      inputModel.recoveryCode,
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
  // @UseGuards(CustomThrottlerGuard)
  @Post('/registration-email-resending')
  @HttpCode(204)
  async emailResending(@Body() inputModel: ResendingDto) {
    const result = await this.authService.emailResending(inputModel.email);
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
  // @UseGuards(CustomThrottlerGuard)
  @Post('/password-recovery')
  @HttpCode(204)
  async passwordResending(@Body() inputModel: ResendingDto) {
    const result = await this.authService.passwordResending(inputModel.email);
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
