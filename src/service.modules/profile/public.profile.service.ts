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
export class PublicProfileService {
  constructor(private prisma: PrismaService, private axiosService: AxiosService) {}

  async getPublicProfile(uuid: string): Promise<any> {
    const vps = await this.prisma.vpnGateVps.findUnique({ where: { uuid } });

    if (!vps || !vps?.profile) {
      throw new CommonException({ message: 'no profile found' }, HttpStatus.FORBIDDEN);
    }

    const encryptedProfile = await cryptoTool.encrypt({ certificate: atob(vps?.profile) }, `${vps.uuid}-${configuration().ENCRYPTION_KEY}`);
    return encryptedProfile;
  }
}
