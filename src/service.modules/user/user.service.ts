import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import cryptoTool from 'src/utils/crypto.tool';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { userAuthDto } from 'src/guards/session.auth/auth/user.auth.dto';
import { PrismaService } from 'src/package.modules/prisma/prisma.service';
import { UserRole } from '@prisma/client';
import configuration from 'src/config/configuration';

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

  async userInfo(userUniqueId: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { uniqueId: userUniqueId },
      select: { email: true },
    });
  }
}
