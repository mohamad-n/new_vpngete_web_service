import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import cryptoTool from 'src/utils/crypto.tool';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { userAuthDto } from 'src/guards/session.auth/auth/user.auth.dto';
import { PrismaService } from 'src/package.modules/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import configuration from 'src/config/configuration';
import { chargeDto } from '../subscription/subscription.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async adminSignup(data: userAuthDto): Promise<any> {
    // if (configuration().NODE_ENV === 'production') {
    //   throw new CommonException({ message: 'endpoint is inactive' }, HttpStatus.CONFLICT);
    // }
    const { email, password: defaultPassword } = data;
    const exitingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exitingUser) {
      throw new CommonException({ message: 'user already exist' }, HttpStatus.CONFLICT);
    }
    const password = await cryptoTool.hash(defaultPassword);
    await this.prisma.user.create({
      data: {
        email,
        password,
        role: UserRole.ADMIN,
      },
    });
    return email;
  }

  async agentSignup(data: userAuthDto): Promise<any> {
    // if (configuration().NODE_ENV === 'production') {
    //   throw new CommonException({ message: 'endpoint is inactive' }, HttpStatus.CONFLICT);
    // }
    const { email, password: defaultPassword } = data;
    const exitingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exitingUser) {
      throw new CommonException({ message: 'user already exist' }, HttpStatus.CONFLICT);
    }
    const password = await cryptoTool.hash(defaultPassword);
    await this.prisma.user.create({
      data: {
        email,
        password,
        role: UserRole.AGENT,
        addedBy: 'ADMIN',
      },
    });
    return email;
  }

  async chargeAgent(data: chargeDto): Promise<any> {
    const { agentId, amount } = data;

    const agent = await this.prisma.user.findFirst({ where: { id: agentId, role: 'AGENT' }, include: { balance: true } });

    if (!agent) {
      throw new CommonException({ message: 'agent not exist' }, HttpStatus.CONFLICT);
    }

    await this.prisma.balance.upsert({ where: { userId: agent.id }, update: { amount: { increment: amount } }, create: { amount, userId: agent.id } });

    await this.prisma.order.create({
      data: { amount, userId: agent.id, issuer: 'ADMIN', direction: 'CHARGE', note: `charge agent "${agent.email}" with duration of ${amount} days` },
    });

    return 'success';
  }

  async userInfo(userUniqueId: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { uniqueId: userUniqueId },
      select: { email: true },
    });
  }
}
