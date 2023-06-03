import { Controller, Post, Body, Res, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { SessionRoles } from 'src/guards/rbac/role.decorator';
import { SessionRole } from 'src/guards/rbac/role.enum';
import { userAuthDto, userCredentialDto } from 'src/guards/session.auth/auth/user.auth.dto';
import { GetUserUniqueId, PublicForSessionBase } from 'src/guards/session.auth/session.auth.decorator';
import { SessionAuthService } from 'src/guards/session.auth/session.auth.service';
import { SessionJwtAuthGuard } from 'src/guards/session.auth/guards/session.jwt.auth.guard';
import { chargeDto } from '../subscription/subscription.dto';
import { RolesGuard } from 'src/guards/rbac/role.guard';

const cookieOptions = (time: number) => {
  return { httpOnly: true, expires: new Date(Date.now() + time) };

  // return process.env.NODE_ENV === 'production' ? { httpOnly: true, expires: new Date(Date.now() + time) } : { httpOnly: true, sameSite: false, secure: true, expires: new Date(Date.now() + time) };
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: SessionAuthService) {}

  // @PublicForSessionBase()
  @Post('admin/signup')
  async adminSignup(@Body() data: userAuthDto): Promise<any> {
    return this.userService.adminSignup(data);
  }

  @Post('admin/signin')
  async adminSignin(@Body() data: userAuthDto, @Res({ passthrough: true }) response: Response) {
    const accessToken = await this.authService.loginUser(data);
    response.cookie('access_token', accessToken, cookieOptions(24 * 3600000));
    return 'success';
  }

  @Get('admin/signout')
  async userSignout(@Res({ passthrough: true }) response: Response) {
    response.cookie('access_token', null, cookieOptions(1));
    return 'you logged out successfully';
  }

  @UseGuards(SessionJwtAuthGuard, RolesGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Get('auth')
  async checkAuth(@Res({ passthrough: true }) response: Response, @GetUserUniqueId() userInfo: userCredentialDto) {
    const accessToken = await this.authService.extendToken(userInfo);
    response.cookie('access_token', accessToken, cookieOptions(24 * 3600000));
    return;
  }
  @UseGuards(SessionJwtAuthGuard, RolesGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Get('info')
  async userInfo(@GetUserUniqueId() userInfo: userCredentialDto) {
    return userInfo;
  }

  @UseGuards(SessionJwtAuthGuard, RolesGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Post('charge')
  async chargeAgent(@Body() data: chargeDto) {
    return this.userService.chargeAgent(data);
  }

  //------- agent signup --------
  // @PublicForSessionBase()
  @Post('agent/signup')
  async agentSignup(@Body() data: userAuthDto): Promise<any> {
    return this.userService.agentSignup(data);
  }

  @Post('agent/signin')
  async agentSignin(@Body() data: userAuthDto, @Res({ passthrough: true }) response: Response) {
    const accessToken = await this.authService.loginUser(data);
    response.cookie('access_token', accessToken, cookieOptions(24 * 3600000));
    return 'success';
  }
}
