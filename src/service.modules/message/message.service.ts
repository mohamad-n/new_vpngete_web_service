import { HttpStatus, Injectable } from '@nestjs/common';

import { ExpoPushService } from './expo.push.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/package.modules/prisma/prisma.service';
import { clientDto } from 'src/guards/token.auth/token.auth.dto';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { title } from 'process';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService, private readonly expoPushService: ExpoPushService) {}

  async getMessages(clientInfo: clientDto): Promise<any> {
    const { clientUuid } = clientInfo;

    return this.prisma.message.findMany({
      where: { OR: [{ type: 'PUBLIC' }, { type: 'PRIVATE', client: { is: { uuid: clientUuid } } }] },
      select: { type: true, description: true, createdAt: true, id: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async sendPrivateMessage(info: { clientId: number; message?: string; data?: { [key: string]: any } }): Promise<any> {
    const { clientId, message, data } = info;
    const client = await this.prisma.client.findUnique({ where: { id: clientId } });
    const savedMessage = await this.prisma.message.create({ data: { clientId: client?.id, description: message, type: 'PRIVATE', data } });

    //---- send single push notification ------
    if (client?.pushNotificationToken) {
      const messageInfo = { to: client?.pushNotificationToken, body: message, data };
      await this.sendPushNotification(messageInfo);
    }

    return savedMessage;
  }

  async sendPublicMessage(info: { message?: string; data?: { [key: string]: any } }): Promise<any> {
    const { message, data } = info;
    const savedMessage = await this.prisma.message.create({ data: { description: message, type: 'PUBLIC', data } });

    //---- send bulk push notification ------

    return savedMessage;
  }

  async sendPushNotification(messageInfo: { to: string; sound?: string; body?: string; data?: { [key: string]: any } }): Promise<any> {
    await this.expoPushService.sendPushNotification(messageInfo);
  }

  async addPushNotificationToken(data: { pushNotificationToken: string }, clientInfo: clientDto): Promise<any> {
    const { pushNotificationToken } = data;

    // console.log('>>>>>>>>>>>', pushNotificationToken);
    const { clientUuid } = clientInfo;

    const client = await this.prisma.client.findUnique({ where: { uuid: clientUuid } });
    if (!client) {
      throw new CommonException({ message: 'no user found' }, HttpStatus.FORBIDDEN);
    }

    await this.prisma.client.update({ where: { id: client.id }, data: { pushNotificationToken, pushNotificationAllowed: true } });
    return { uuid: client.uuid, pushNotificationAllowed: true };
  }
}
