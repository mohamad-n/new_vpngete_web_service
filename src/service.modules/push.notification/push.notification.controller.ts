import { Controller, Post, Put, Body, Get, UseGuards, Query } from '@nestjs/common';

import { SessionRole } from 'src/guards/rbac/role.enum';
import { SessionRoles } from 'src/guards/rbac/role.decorator';
import { SessionJwtAuthGuard } from 'src/guards/session.auth/guards/session.jwt.auth.guard';
import { PushNotificationService } from './push.notification.service';
import { AccessTokenJwtAuthGuard } from 'src/guards/token.auth/guards/access.token.jwt.auth.guard';
import { GetClientUniqueIds } from 'src/guards/token.auth/token.auth.decorator';
import { clientDto } from 'src/guards/token.auth/token.auth.dto';

@Controller('notifications')
export class PushNotificationController {
  constructor(private readonly pushNotificationService: PushNotificationService) {}

  @UseGuards(AccessTokenJwtAuthGuard)
  @Post('token/save')
  async addPushNotificationToken(@Body() data: { pushNotificationToken: string }, @GetClientUniqueIds() clientInfo: clientDto) {
    return this.pushNotificationService.addPushNotificationToken(data, clientInfo);
  }

  // @UseGuards(AccessTokenJwtAuthGuard)
  // @Get('toggle')
  // async togglePushNotificationStatus(@GetClientUniqueIds() clientInfo: clientDto) {
  //   return this.pushNotificationService.togglePushNotificationStatus(clientInfo);
  // }
  // @UseGuards(AccessTokenJwtAuthGuard)
  // @Get('state')
  // async getclientNotificationState(@GetClientUniqueIds() clientInfo: clientDto) {
  //   return this.pushNotificationService.getclientNotificationState(clientInfo);
  // }
}
