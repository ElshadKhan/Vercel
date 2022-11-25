import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Ip,
  Res,
  UseGuards,
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

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionsService: SessionsService,
    private sessionsRepository: SessionsRepository,
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

  @Post()
  async create(@Body() inputModel: CreateUserDto) {
    return await this.authService.create(inputModel);
  }

  @Post('/login')
  async login(@Body() inputModel: LoginUserDto, @Req() req, @Res() res) {
    const user = await this.authService.checkCredentials(inputModel);
    if (!user) return user;

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

  @Post()
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

  @Post()
  async logoutUser(@Req() req) {
    const payload = await this.jwtService.getUserIdByRefreshToken(
      req.cookies.refreshToken.split(' ')[0],
    );
    return await this.sessionsRepository.deleteSessionsByDeviceId(
      payload.userId,
      payload.deviceId,
    );
  }

  @Post()
  async confirmationEmail(@Body() inputModel: ConfirmationCodeDto) {
    return await this.authService.confirmationEmail(inputModel.code);
  }

  @Post()
  async confirmationPassword(@Body() inputModel: PasswordConfirmationCodeDto) {
    return await this.authService.confirmationPassword(
      inputModel.newPassword,
      inputModel.recoveryCode,
    );
  }

  @Post()
  async emailResending(@Body() inputModel: ResendingDto) {
    return await this.authService.emailResending(inputModel.email);
  }

  @Post()
  async passwordResending(@Body() inputModel: ResendingDto) {
    return await this.authService.passwordResending(inputModel.email);
  }
}
