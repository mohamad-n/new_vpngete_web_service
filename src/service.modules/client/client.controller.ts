import { Controller, Post, Body, Get, UseGuards, Query, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { AccessTokenJwtAuthGuard } from 'src/guards/token.auth/guards/access.token.jwt.auth.guard';
import { GetClientRefreshTokenInfo, GetClientUniqueIds } from 'src/guards/token.auth/token.auth.decorator';
import { refreshTokenPayloadDto, clientDto, clientRegistrationDto } from 'src/guards/token.auth/token.auth.dto';
import { RefreshTokenJwtAuthGuard } from 'src/guards/token.auth/guards/refresh.token.jwt.auth.guard';
import { SessionRoles } from 'src/guards/rbac/role.decorator';
import { SessionRole } from 'src/guards/rbac/role.enum';
import { SessionJwtAuthGuard } from 'src/guards/session.auth/guards/session.jwt.auth.guard';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('register')
  async clientSignup(@Body() registrationData: clientRegistrationDto) {
    return this.clientService.clientSignup(registrationData);
  }

  @Post('login')
  async clientSignin(@Body() registrationData: clientRegistrationDto) {
    return this.clientService.clientSignin(registrationData);
  }

  @UseGuards(RefreshTokenJwtAuthGuard)
  @Get('token/refresh')
  async refreshToken(@GetClientRefreshTokenInfo() info: refreshTokenPayloadDto) {
    return this.clientService.refreshToken(info);
  }
  @UseGuards(AccessTokenJwtAuthGuard)
  @Get('signout')
  async clientSignout(@GetClientUniqueIds() clientInfo: clientDto) {
    return this.clientService.clientSignout(clientInfo);
  }

  @UseGuards(AccessTokenJwtAuthGuard)
  @Get('info')
  async getClientInfo(@GetClientUniqueIds() clientInfo: clientDto) {
    return this.clientService.getClientInfo(clientInfo);
  }

  // @UseGuards(SessionJwtAuthGuard)
  // @SessionRoles(SessionRole.ADMIN)
  // @Get('list')
  // async getAllClients() {
  //   return this.clientService.getAllClients();
  // }

  @UseGuards(SessionJwtAuthGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Delete('')
  async deleteClient(@Query('id') id) {
    return this.clientService.deleteClient(Number(id));
  }
}
