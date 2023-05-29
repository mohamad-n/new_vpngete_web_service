import { HttpStatus, Injectable } from '@nestjs/common';

import { ExpoPushService } from './expo.push.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PrismaService } from 'src/package.modules/prisma/prisma.service';
import { clientDto } from 'src/guards/token.auth/token.auth.dto';
import { CommonException } from 'src/interceptors/exception/error.interceptor';

@Injectable()
export class PushNotificationService {
  constructor(private prisma: PrismaService, private readonly expoPushService: ExpoPushService) {}

  async sendMessage(messageInfo: { to: string; sound?: string; body?: string; data?: { [key: string]: any } }): Promise<any> {
    return this.expoPushService.sendPushNotification(messageInfo);
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

  // async togglePushNotificationStatus(clientInfo: clientDto): Promise<any> {
  //   const { clientUuid, clientUuid } = clientInfo;

  //   const client = await this.prisma.client.findUnique({ where: { uuid: clientUuid } });
  //   if (!client) {
  //     throw new CommonException({ message: 'no user found' }, HttpStatus.FORBIDDEN);
  //   }

  //   await this.prisma.client.update({ where: { id: client.id }, data: { pushNotificationAllowed: !client?.pushNotificationAllowed } });
  //   return { uuid: client.uuid, pushNotificationAllowed: !client.pushNotificationAllowed };
  // }

  // async getclientNotificationState(clientInfo: clientDto): Promise<any> {
  //   const { clientUuid, clientUuid } = clientInfo;

  //   const client = await this.prisma.client.findUnique({
  //     where: { uuid: clientUuid },
  //     select: {
  //       pushNotificationAllowed: true,
  //       pushNotificationToken: true,
  //     },
  //   });

  //   if (!client.pushNotificationToken) {
  //     throw new CommonException({ message: 'no token found found' }, HttpStatus.FORBIDDEN);
  //   }
  //   return client.pushNotificationAllowed;
  // }
}
