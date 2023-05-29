import { HttpStatus, Injectable } from '@nestjs/common';

import { Expo } from 'expo-server-sdk';

import configuration from 'src/config/configuration';
import { ExpoPushMessage } from 'expo-server-sdk';
import { CommonException } from 'src/interceptors/exception/error.interceptor';

@Injectable()
export class ExpoPushService {
  private expo: Expo;
  constructor() {
    this.expo = new Expo({ accessToken: configuration().EXPO_PUSH_TOKEN });
  }

  async sendPushNotification(messageInfo: { to: string; sound?: string; body?: string; data?: { [key: string]: any } }): Promise<any> {
    try {
      const { to, sound, body, data } = messageInfo;
      const toSendBody: ExpoPushMessage[] = [
        {
          to,
          sound: 'default',
          body,
          data,
          badge: 1,
        },
      ];
      const transport = await this.expo.sendPushNotificationsAsync(toSendBody);

      return transport;
    } catch (error) {
      throw new CommonException({ message: error?.message }, HttpStatus.CONFLICT);
    }
  }
}
