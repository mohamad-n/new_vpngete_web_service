import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import cryptoTool from 'src/utils/crypto.tool';
import { PrismaService } from '../../../package.modules/prisma/prisma.service';
import { userAuthDto, userCredentialDto, userInfoDto } from './user.auth.dto';
import { UserStatus } from '@prisma/client';
import { SessionRole } from 'src/guards/rbac/role.enum';

@Injectable()
export class UserAuthService {
  constructor(private prisma: PrismaService) {}

  async authenticateUser(data: userAuthDto): Promise<any> {
    const { email, password } = data;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new CommonException({ message: 'user not found' }, HttpStatus.FORBIDDEN);
    }

    if (user.status !== UserStatus.VERIFIED) {
      throw new CommonException({ message: `user on ${user.status.toLowerCase()} status` }, HttpStatus.FORBIDDEN);
    }
    const isPasswordMatch = await cryptoTool.isMatch(password, user.password);

    if (!isPasswordMatch) {
      throw new CommonException({ message: 'invalid password' }, HttpStatus.FORBIDDEN);
    }

    return { uniqueId: user.uniqueId, role: user.role };
  }

  async generateTokenByUniqueId(userInfo: userCredentialDto): Promise<any> {
    const { uniqueId, role } = userInfo;
    const user = await this.prisma.user.findUnique({
      where: { uniqueId },
    });
    if (!user) {
      throw new CommonException({ message: 'invalid agent' }, HttpStatus.FORBIDDEN);
    }

    return { uniqueId, role, email: user.email };
  }

  //----- check user activation status -------

  async checkUserStatus(data: userInfoDto): Promise<any> {
    try {
      const { uniqueId } = data;
      const user = await this.prisma.user.findUnique({
        where: { uniqueId },
      });

      return Promise.resolve(
        plainToClass(
          userCredentialDto,
          { ...user, role: user.role },

          { excludeExtraneousValues: true }
        )
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
