import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SessionJwtAuthGuard } from 'src/guards/session.auth/guards/session.jwt.auth.guard';
import { SessionRole } from 'src/guards/rbac/role.enum';
import { SessionRoles } from 'src/guards/rbac/role.decorator';
import { settingVersionDto } from './setting.dto';
import { RolesGuard } from 'src/guards/rbac/role.guard';

@Controller('setting')
export class SettingController {
  constructor(private readonly SettingService: SettingService) {}

  @UseGuards(SessionJwtAuthGuard, RolesGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Post()
  async updateSetting(@Body() info: settingVersionDto) {
    return this.SettingService.updateSetting(info);
  }

  @Get('version')
  async getLastVersion() {
    return this.SettingService.getLastVersion();
  }
}
