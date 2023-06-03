import { Controller, Post, Put, Body, Get, UseGuards, Query } from '@nestjs/common';
import { PrivateVpsService } from './private.vps.service';
import { TokenAuthService } from 'src/guards/token.auth/token.auth.service';
import { AccessTokenJwtAuthGuard } from 'src/guards/token.auth/guards/access.token.jwt.auth.guard';
import { GetClientUniqueIds } from 'src/guards/token.auth/token.auth.decorator';
import { vpsCreateDto, vpsUpdateDto } from './vps.dto';
import { SessionRoles } from 'src/guards/rbac/role.decorator';
import { SessionRole } from 'src/guards/rbac/role.enum';
import { SessionJwtAuthGuard } from 'src/guards/session.auth/guards/session.jwt.auth.guard';
import { PublicVpsService } from './public.vps.service';

@Controller('vps')
export class VpsController {
  constructor(private readonly privateVpsService: PrivateVpsService, private readonly publicVpsService: PublicVpsService) {}

  // @UseGuards(SessionJwtAuthGuard)
  // @SessionRoles(SessionRole.ADMIN)
  @Get('public/list')
  async listPublicVps() {
    return this.publicVpsService.listPublicVps();
  }

  @UseGuards(SessionJwtAuthGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Get('public/update')
  async updatePublicVps() {
    return this.publicVpsService.getVPNGateServers();
  }

  @UseGuards(SessionJwtAuthGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Post()
  async addVps(@Body() VpsDto: vpsCreateDto) {
    return this.privateVpsService.addVps(VpsDto);
  }

  @UseGuards(SessionJwtAuthGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Put()
  async updateVps(@Body() VpsDto: vpsUpdateDto) {
    return this.privateVpsService.updateVps(VpsDto);
  }

  // @UseGuards(SessionJwtAuthGuard)
  // @SessionRoles(SessionRole.ADMIN)
  // @Post('location')
  // async addLocation(@Body() data: locationCreateDto) {
  //   return this.VpsService.addLocation(data);
  // }

  // @UseGuards(SessionJwtAuthGuard)
  // @SessionRoles(SessionRole.ADMIN)
  // @Put('location')
  // async updateLocation(@Body() data: locationUpdateDto) {
  //   return this.VpsService.updateLocation(data);
  // }

  @UseGuards(AccessTokenJwtAuthGuard)
  @Get('available')
  async getAvailableVps() {
    return this.privateVpsService.getAvailableVps();
  }
}
