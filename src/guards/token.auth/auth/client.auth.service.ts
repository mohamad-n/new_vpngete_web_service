import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { PrismaService } from '../../../package.modules/prisma/prisma.service';
import { clientDto } from '../token.auth.dto';

@Injectable()
export class ClientAuthService {
  constructor(private prisma: PrismaService) {}

  async authenticateClient(data: clientDto): Promise<any> {
    const { clientUuid } = data;
    const client = await this.prisma.client.findUnique({
      where: { uuid: clientUuid },
    });

    if (!client) {
      throw new CommonException({ message: 'client not found' }, HttpStatus.FORBIDDEN);
    }

    if (!client.isActive) {
      throw new CommonException({ message: `client is not active` }, HttpStatus.FORBIDDEN);
    }

    return data;
  }
}
