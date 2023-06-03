import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../package.modules/prisma/prisma.service';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { RandomService } from 'src/utils/random';
import cryptoTool from 'src/utils/crypto.tool';
import * as moment from 'moment';
// import { clientAuthDto } from 'src/guards/token.auth/auth/client.auth.dto';
import { TokenAuthService } from 'src/guards/token.auth/token.auth.service';
import configuration from 'src/config/configuration';
import { getProfileDto } from './profile.dto';
import { clientDto } from 'src/guards/token.auth/token.auth.dto';
import { Vps } from '@prisma/client';
import { AxiosService } from 'src/package.modules/axios/axios.service';

@Injectable()
export class PrivateProfileService {
  constructor(private prisma: PrismaService, private axiosService: AxiosService) {}

  async getClientProfile(info: getProfileDto, clientInfo: clientDto): Promise<any> {
    const { clientUuid } = clientInfo;
    const { id: vpsId } = info;

    const client = await this.prisma.client.findUnique({
      where: { uuid: clientUuid },
      include: { subscription: true },
    });

    const subscription = client.subscription;
    const vps = await this.prisma.vps.findUnique({ where: { id: vpsId } });

    if (!client || !vps) {
      throw new CommonException({ message: 'invalid client info' }, HttpStatus.FORBIDDEN);
    }

    if (!client.isActive) {
      throw new CommonException({ message: 'client is not active' }, HttpStatus.FORBIDDEN);
    }

    if (subscription.expiredAt < new Date()) {
      throw new CommonException({ message: 'subscription expired' }, HttpStatus.FORBIDDEN);
    }

    const profileForClient = await this.prisma.profile.findUnique({ where: { clientId_vpsId: { vpsId, clientId: client.id } } });

    if (profileForClient?.certificate) {
      return profileForClient?.certificate;

      //   return cryptoTool.decrypt(profileForclient?.certificate, `${clientUuid}-${vps.uuid}`);
    }

    return this.createClientProfile(vps.id, client.uuid);
  }

  async createClientProfile(vpsId: number, uuid: string): Promise<any> {
    const vps = await this.prisma.vps.findUnique({ where: { id: vpsId } });
    const client = await this.prisma.client.findUnique({ where: { uuid } });

    const { profile, clientUuid } = await this.downloadclientCertificateFromvps(vps, client.uuid);
    if (clientUuid !== client.uuid) {
      throw new CommonException({ message: 'inconvenience cert name' }, HttpStatus.FORBIDDEN);
    }
    const certificate = await cryptoTool.encrypt({ certificate: profile }, `${clientUuid}-${vps.uuid}-${configuration().ENCRYPTION_KEY}`);
    // await this.prisma.profile.create({ data: { vps: { connect: { id: vps.id } }, client: { connect: { id: client.id } }, certificate } });
    await this.prisma.profile.upsert({
      where: { clientId_vpsId: { clientId: client.id, vpsId: vps.id } },
      update: { certificate },
      create: { vps: { connect: { id: vps.id } }, client: { connect: { id: client.id } }, certificate },
    });

    return certificate;
  }

  async downloadclientCertificateFromvps(vps: Vps, name: string): Promise<any> {
    const baseURL = `http://${vps.ip}:${vps.port}`;
    const url = '/api/account';
    const secret = await cryptoTool.encrypt({ expireTime: moment().add(configuration().RECEIVED_WINDOW_TIMEOUT, 's').utc() }, vps.key);
    const headers = {
      secret,
      'Content-Type': 'application/json',
    };
    const data = { name };
    const { result } = await this.axiosService.createRequest({ method: 'POST', baseURL, url, headers, data });

    const { profile, name: clientUuid } = await cryptoTool.decrypt(result, vps.key);
    return { profile, clientUuid };
  }

  async resetProfiles(id: number): Promise<any> {
    return this.prisma.profile.deleteMany({ where: { clientId: id } });
  }

  async resetAllProfiles(): Promise<any> {
    return this.prisma.profile.deleteMany();
  }
}
