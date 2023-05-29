import { Controller, Post, Put, Body, Get, UseGuards, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AccessTokenJwtAuthGuard } from 'src/guards/token.auth/guards/access.token.jwt.auth.guard';
import { GetClientUniqueIds } from 'src/guards/token.auth/token.auth.decorator';
import { clientDto } from 'src/guards/token.auth/token.auth.dto';
import { getProfileDto } from './profile.dto';
import { SessionJwtAuthGuard } from 'src/guards/session.auth/guards/session.jwt.auth.guard';
import { SessionRoles } from 'src/guards/rbac/role.decorator';
import { SessionRole } from 'src/guards/rbac/role.enum';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AccessTokenJwtAuthGuard)
  @Post('fetch')
  async getClientProfile(@Body() info: getProfileDto, @GetClientUniqueIds() subscriberInfo: clientDto) {
    return this.profileService.getClientProfile(info, subscriberInfo);
  }

  @UseGuards(SessionJwtAuthGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Get('subscriber/reset')
  async resetProfiles(@Query('id') id) {
    return this.profileService.resetProfiles(Number(id));
  }

  @UseGuards(SessionJwtAuthGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Get('all/reset')
  async resetAllProfiles() {
    return this.profileService.resetAllProfiles();
  }
}
