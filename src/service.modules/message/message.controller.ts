import { Controller, Post, Put, Body, Get, UseGuards, Query } from '@nestjs/common';

import { SessionRole } from 'src/guards/rbac/role.enum';
import { SessionRoles } from 'src/guards/rbac/role.decorator';
import { SessionJwtAuthGuard } from 'src/guards/session.auth/guards/session.jwt.auth.guard';
import { MessageService } from './message.service';
import { AccessTokenJwtAuthGuard } from 'src/guards/token.auth/guards/access.token.jwt.auth.guard';
import { GetClientUniqueIds } from 'src/guards/token.auth/token.auth.decorator';
import { clientDto } from 'src/guards/token.auth/token.auth.dto';
import { RolesGuard } from 'src/guards/rbac/role.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly MessageService: MessageService) {}

  @UseGuards(AccessTokenJwtAuthGuard)
  @Get('list')
  async getMessages(@GetClientUniqueIds() clientInfo: clientDto) {
    return this.MessageService.getMessages(clientInfo);
  }

  @UseGuards(AccessTokenJwtAuthGuard)
  @Post('token/save')
  async addPushNotificationToken(@Body() data: { pushNotificationToken: string }, @GetClientUniqueIds() clientInfo: clientDto) {
    return this.MessageService.addPushNotificationToken(data, clientInfo);
  }

  @UseGuards(SessionJwtAuthGuard, RolesGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Post('private')
  async sendPrivateMessage(@Body() info: { clientId: number; message?: string; data?: { [key: string]: any } }) {
    return this.MessageService.sendPrivateMessage(info);
  }

  @UseGuards(SessionJwtAuthGuard, RolesGuard)
  @SessionRoles(SessionRole.ADMIN)
  @Post('public')
  async sendPublicMessage(@Body() info: { message?: string; data?: { [key: string]: any } }) {
    return this.MessageService.sendPublicMessage(info);
  }
}
