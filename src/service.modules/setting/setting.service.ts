import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../package.modules/prisma/prisma.service';

import { settingVersionDto } from './setting.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async updateSetting(info: settingVersionDto): Promise<any> {
    const existingSetting = await this.prisma.setting.findFirst();

    return existingSetting
      ? this.prisma.setting.update({ where: { id: existingSetting.id }, data: { versionInfo: info as Prisma.JsonObject } })
      : this.prisma.setting.create({ data: { versionInfo: info as Prisma.JsonObject } });
  }

  async getLastVersion(): Promise<any> {
    const existingSetting = await this.prisma.setting.findFirst();
    return existingSetting?.versionInfo;
  }
}
