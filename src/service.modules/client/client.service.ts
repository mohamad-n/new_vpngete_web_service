import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../package.modules/prisma/prisma.service';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { RandomService } from 'src/utils/random';
import cryptoTool from 'src/utils/crypto.tool';
import * as moment from 'moment';
import { TokenAuthService } from 'src/guards/token.auth/token.auth.service';
import configuration from 'src/config/configuration';
import { refreshTokenPayloadDto, clientDto, clientRegistrationDto } from 'src/guards/token.auth/token.auth.dto';

import { DeviceOS } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService, private readonly randomService: RandomService, private readonly authService: TokenAuthService) {}

  async clientSignup(data: clientRegistrationDto): Promise<{ clientUuid: string }> {
    const { email, password: incomingPassword, deviceManufacturer, deviceOs, deviceOsVersion, appVersion, deviceModelName, timeZone, deviceSpecificId } = data;

    const existingClient = await this.prisma.client.findUnique({ where: { email } });

    if (existingClient) {
      throw new CommonException({ message: 'This email already registered' }, HttpStatus.FORBIDDEN);
    }
    const password = await cryptoTool.hash(incomingPassword);
    const client = await this.prisma.client.create({
      data: { email, password, deviceManufacturer, deviceOs, deviceOsVersion, appVersion, deviceModelName, timeZone, deviceSpecificId },
    });

    // const { accessToken, refreshToken } = await this.createRefreshToken({ clientId: client.id, clientUuid: client.uuid });
    return { clientUuid: client.uuid };
  }

  async clientSignin(data: clientRegistrationDto): Promise<any> {
    const { email, password: incomingPassword, deviceManufacturer, deviceOs, deviceOsVersion, appVersion, deviceModelName, timeZone, deviceSpecificId } = data;
    const client = await this.prisma.client.findUnique({ where: { email } });

    if (!client) {
      throw new CommonException({ message: 'user not found' }, HttpStatus.FORBIDDEN);
    }

    if (!client?.isActive) {
      throw new CommonException({ message: 'Client is inactive. please contact support.' }, HttpStatus.FORBIDDEN);
    }
    const passwordIsMatch = await cryptoTool.isMatch(incomingPassword, client.password);

    if (!passwordIsMatch) {
      throw new CommonException({ message: 'invalid password' }, HttpStatus.FORBIDDEN);
    }

    const updatedClient = await this.prisma.client.update({
      where: { id: client.id },
      data: { deviceManufacturer, deviceOs, deviceOsVersion, appVersion, deviceModelName, timeZone, deviceSpecificId },
      include: { subscription: { select: { expiredAt: true } } },
    });
    const { accessToken, refreshToken } = await this.createRefreshToken({ clientId: client.id, clientUuid: client.uuid });
    return { clientUuid: client.uuid, accessToken, refreshToken, subscription: { ...updatedClient.subscription, inactiveDevice: false, inactiveClient: false } };
  }

  async clientSignout(clientInfo: clientDto): Promise<any> {
    const { clientUuid } = clientInfo;
    const client = await this.prisma.client.findUnique({ where: { uuid: clientUuid } });

    await this.prisma.refreshToken.delete({ where: { clientId: client.id } });

    return clientUuid;
  }

  async refreshToken(refreshTokenInfo: refreshTokenPayloadDto): Promise<any> {
    const { clientUuid, refreshToken: incomingRefreshToken, refreshTokenId } = refreshTokenInfo;
    // console.log('>>>>>>>>>>>', clientUuid, clientUuid, incomingRefreshToken, refreshTokenId);

    console.log('>>>>>>>>>>>', 'calling refresh ');
    const client = await this.prisma.client.findUnique({ where: { uuid: clientUuid } });

    if (!client) {
      throw new CommonException({ message: 'invalid user' }, HttpStatus.FORBIDDEN);
    }

    const existingRefreshToken = await this.prisma.refreshToken.findUnique({ where: { id: refreshTokenId } });

    if (!existingRefreshToken || existingRefreshToken?.clientId !== client.id) {
      throw new CommonException({ message: 'invalid token' }, HttpStatus.FORBIDDEN);
    }

    // check refreshToken hash
    const isMatched = await cryptoTool.isMatch(incomingRefreshToken, existingRefreshToken.hash);
    if (!isMatched) {
      throw new CommonException({ message: 'malformed token' }, HttpStatus.FORBIDDEN);
    }
    const { accessToken, refreshToken } = await this.authService.generateTokenForClient({ clientUuid }, refreshTokenId);
    return { accessToken, refreshToken };
  }

  async createRefreshToken(data: { clientId: number; clientUuid: string }): Promise<{ accessToken: string; refreshToken: string }> {
    const { clientId, clientUuid } = data;

    const refreshTokenSaved = await this.prisma.refreshToken.upsert({
      where: { clientId },
      update: {
        expiredAt: new Date(moment().add(configuration().TOKEN_REFRESH_AUTH_EXP_IN_DAY, 'days').toISOString()),
      },
      create: {
        client: { connect: { id: clientId } },
        expiredAt: new Date(moment().add(configuration().TOKEN_REFRESH_AUTH_EXP_IN_DAY, 'days').toISOString()),
      },
    });
    const { accessToken, refreshToken } = await this.authService.generateTokenForClient({ clientUuid }, refreshTokenSaved.id);

    await this.prisma.refreshToken.update({
      where: { id: refreshTokenSaved.id },
      data: { hash: await cryptoTool.hash(refreshToken) },
    });

    return { accessToken, refreshToken };
  }

  async getClientInfo(clientInfo: clientDto): Promise<any> {
    const { clientUuid } = clientInfo;

    const client = await this.prisma.client.findUnique({
      where: { uuid: clientUuid },
      select: {
        id: true,
        email: true,
        uuid: true,

        subscription: { select: { expiredAt: true } },
      },
    });

    if (!client) {
      throw new CommonException({ message: 'no user found' }, HttpStatus.FORBIDDEN);
    }

    return client;
  }

  async deleteClient(id: number): Promise<any> {
    return this.prisma.client.delete({ where: { id } });
  }
}
