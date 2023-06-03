import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../package.modules/prisma/prisma.service';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { RandomService } from 'src/utils/random';
import cryptoTool from 'src/utils/crypto.tool';
import * as moment from 'moment';
// import { clientAuthDto } from 'src/guards/token.auth/auth/client.auth.dto';
import { TokenAuthService } from 'src/guards/token.auth/token.auth.service';
import configuration from 'src/config/configuration';
import { appVersionDto, clientDto, clientRegistrationDto, clientRegistrationWithVoucherDto } from 'src/guards/token.auth/token.auth.dto';
import { DeviceOS, Prisma } from '@prisma/client';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { createVoucherDto, recheckReceiptIosDto, verifyAlreadyReceiptIosDto } from './subscription.dto';
import { AxiosService } from 'src/package.modules/axios/axios.service';
import { ClientService } from '../client/client.service';
import { userCredentialDto } from 'src/guards/session.auth/auth/user.auth.dto';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService, private randomService: RandomService, private clientService: ClientService) {}

  async getClientSubscription(clientInfo: clientDto, deviceSpecificId: string): Promise<any> {
    const { clientUuid } = clientInfo;

    const client = await this.prisma.client.findFirst({
      where: { uuid: clientUuid },
      include: {
        subscription: { select: { expiredAt: true } },
      },
    });

    if (!client) {
      throw new CommonException({ message: 'no user found' }, HttpStatus.FORBIDDEN);
    }
    const { subscription } = client;

    if (client?.deviceSpecificId !== deviceSpecificId) {
      const { deviceManufacturer, deviceOsVersion, deviceModelName } = client;
      return { ...subscription, inactiveDevice: true, inactiveClient: !client.isActive, extraInfo: { deviceManufacturer, deviceOsVersion, deviceModelName } };
    }

    const existingSetting = await this.prisma.setting.findFirst();
    return { subscription: { ...subscription, inactiveDevice: false, inactiveClient: !client.isActive }, versionInfo: existingSetting?.versionInfo };
  }

  async createVoucher(data: createVoucherDto, userCredential: userCredentialDto): Promise<any> {
    const { uniqueId, role } = userCredential;
    const { alias, duration, validationDurationInHour } = data;

    if (role !== 'AGENT') {
      throw new CommonException({ message: 'voucher generate only available for agents' }, HttpStatus.CONFLICT);
    }
    const agent = await this.prisma.user.findUnique({ where: { uniqueId }, include: { balance: true } });

    if (!agent) {
      throw new CommonException({ message: 'agent not exist' }, HttpStatus.CONFLICT);
    }
    if (!agent?.balance?.amount || agent?.balance?.amount < duration) {
      throw new CommonException({ message: 'insufficient balance' }, HttpStatus.CONFLICT);
    }

    //vgate://activate_v2/
    const code = `${this.randomService.randNumberString(6)}-${this.randomService.randNumberString(6)}-${this.randomService.randNumberString(6)}`;
    const activationCode = await this.prisma.activationCode.create({ data: { alias, duration, validationDurationInHour, issuerId: agent.id, code } });

    await this.prisma.balance.update({ where: { userId: agent.id }, data: { amount: { increment: -duration } } });

    await this.prisma.order.create({
      data: { amount: duration, userId: agent.id, issuer: 'SELF', direction: 'CONSUME', note: `create a voucher code for alias ${alias} with duration of ${duration} days` },
    });

    return activationCode;
  }

  async consumeVoucherByClient(data: clientDto, code: string, deviceSpecificId: string): Promise<any> {
    const { clientUuid } = data;

    const client = await this.prisma.client.findFirst({ where: { uuid: clientUuid }, include: { subscription: true } });

    if (!client) {
      throw new CommonException({ message: 'client is not exist ' }, HttpStatus.CONFLICT);
    }

    // if (!client.isActive) {
    //   throw new CommonException({ message: 'client is not active' }, HttpStatus.CONFLICT);
    // }

    if (client.deviceSpecificId !== deviceSpecificId) {
      return { inactiveClient: !client.isActive, inactiveDevice: true, activeDeviceInfo: { deviceManufacturer: client?.deviceManufacturer, deviceModelName: client?.deviceModelName } };

      // throw new CommonException({ message: `client already active on another device : model :${client.deviceManufacturer} - ${client.deviceModelName} ` }, HttpStatus.CONFLICT);
    }

    const activationCode = await this.prisma.activationCode.findUnique({ where: { code } });

    if (!activationCode) {
      throw new CommonException({ message: 'invalid voucher' }, HttpStatus.CONFLICT);
    }

    if (activationCode.isConsumed) {
      throw new CommonException({ message: 'voucher already used' }, HttpStatus.CONFLICT);
    }
    if (moment(activationCode?.createdAt).add(activationCode.validationDurationInHour, 'hours').isBefore(moment())) {
      throw new CommonException({ message: 'voucher is expired' }, HttpStatus.CONFLICT);
    }

    if (!client?.subscription) {
      await this.prisma.subscription.create({ data: { startedAt: new Date(), expiredAt: moment().add(activationCode.duration, 'days').toISOString(), clientId: client.id } });
    }

    if (client?.subscription) {
      await this.prisma.subscription.update({
        where: { clientId: client.id },
        data: { expiredAt: moment(client?.subscription?.expiredAt).add(activationCode.duration, 'days').toISOString() },
      });
    }

    await this.prisma.activationCode.update({ where: { id: activationCode.id }, data: { isConsumed: true, consumerId: client.id } });

    const subscription = await this.prisma.subscription.findUnique({ where: { clientId: client.id }, select: { expiredAt: true } });

    return { ...subscription, inactiveDevice: false, inactiveClient: !client.isActive };
  }

  async consumeVoucherByAnonymous(data: clientRegistrationWithVoucherDto): Promise<any> {
    const { code, emailPrePhrase, deviceManufacturer, deviceOs, deviceOsVersion, appVersion, deviceModelName, timeZone, deviceSpecificId } = data;

    const activationCode = await this.prisma.activationCode.findUnique({ where: { code }, include: { issuer: true } });

    if (!activationCode) {
      throw new CommonException({ message: 'invalid voucher' }, HttpStatus.CONFLICT);
    }

    if (activationCode.isConsumed) {
      throw new CommonException({ message: 'voucher already used' }, HttpStatus.CONFLICT);
    }
    if (moment(activationCode?.createdAt).add(activationCode.validationDurationInHour, 'hours').isBefore(moment())) {
      throw new CommonException({ message: 'voucher is expired' }, HttpStatus.CONFLICT);
    }

    const randomPassword = this.randomService.randString(20);
    const email = `${emailPrePhrase}_${this.randomService.randString(5)}${activationCode?.issuer?.userEmailPassPhrase || '@vpngate.online'}`;
    const password = await cryptoTool.hash(randomPassword);
    const client = await this.prisma.client.create({
      data: { email, password, deviceManufacturer, deviceOs, deviceOsVersion, appVersion, deviceModelName, timeZone, deviceSpecificId },
    });

    await this.prisma.subscription.create({ data: { startedAt: new Date(), expiredAt: moment().add(activationCode.duration, 'days').toISOString(), clientId: client.id } });

    await this.prisma.activationCode.update({ where: { id: activationCode.id }, data: { isConsumed: true, consumerId: client.id } });

    const subscription = await this.prisma.subscription.findUnique({ where: { clientId: client.id }, select: { expiredAt: true } });

    const { accessToken, refreshToken } = await this.clientService.createRefreshToken({ clientId: client.id, clientUuid: client.uuid });
    return { email: client?.email, clientUuid: client.uuid, accessToken, refreshToken, subscription: { ...subscription, inactiveDevice: false, inactiveClient: false } };

    // return { ...subscription, inactiveDevice: false, inactiveClient: !client.isActive };
  }
}
