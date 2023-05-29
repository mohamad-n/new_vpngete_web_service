import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';

import { UserAuthService } from './auth/user.auth.service';
import { JwtService } from '@nestjs/jwt';
import { userAuthDto, userCredentialDto, userInfoDto } from './auth/user.auth.dto';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { SessionRole } from '../rbac/role.enum';

@Injectable()
export class SessionAuthService {
  constructor(private readonly UserAuthService: UserAuthService, private readonly jwtService: JwtService) {}

  async validateUser(data: userAuthDto): Promise<any> {
    const user = await this.UserAuthService.authenticateUser(data);

    if (!user) {
      throw new CommonException({ message: 'user not found' }, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async loginUser(data: userAuthDto) {
    const user = await this.validateUser(data);
    return this.jwtService.sign(user);
  }

  // async refreshUserToken(token: string) {
  //   try {
  //     const decoded: string | { [key: string]: any } = this.jwtService.decode(token);

  //     // if (!decoded["uniqueId"] || !decoded["role"]) {
  //     // 	throw new CommonException({ message: "error on refresh token" }, HttpStatus.NOT_FOUND);
  //     // }
  //     return this.extendToken(decoded['uniqueId'], decoded['role']);
  //   } catch (error) {
  //     console.log('error on refresh token : ', token);

  //     throw new CommonException({ message: 'error on refresh token' }, HttpStatus.NOT_FOUND);
  //   }
  // }

  async generateTokenByUniqueId(userInfo: userCredentialDto): Promise<any> {
    const user = await this.UserAuthService.generateTokenByUniqueId(userInfo);
    if (!user) {
      throw new CommonException({ message: 'user not found' }, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async extendToken(userInfo: userCredentialDto) {
    const agent = await this.generateTokenByUniqueId(userInfo);
    return this.jwtService.sign(agent);
  }

  async checkUserStatus(data: userInfoDto) {
    return this.UserAuthService.checkUserStatus(data);
  }
}
