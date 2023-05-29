import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../package.modules/prisma/prisma.service';
import { vpsCreateDto, vpsUpdateDto } from './vps.dto';

@Injectable()
export class VpsService {
  constructor(private prisma: PrismaService) {}

  async listPrivateVps(): Promise<any> {
    return this.prisma.vps.findMany();
  }
  async addVps(vpsDto: vpsCreateDto): Promise<any> {
    return this.prisma.vps.create({ data: vpsDto });
  }

  async updateVps(vpsDto: vpsUpdateDto): Promise<any> {
    const { id, ...vpsUpdate } = vpsDto;
    return this.prisma.vps.update({ where: { id }, data: vpsUpdate });
  }

  // async getAvailableVps(timeZone: string): Promise<any> {
  //   const recommendedvpss = await this.prisma.vps.findMany({
  //     where: { isActive: true, isVip: false },
  //     select: { uuid: true, id: true, name: true, location: { select: { region: true, name: true, flag: true } } },
  //     orderBy: { vpsReport: { rxSpeed: 'asc' } },
  //     take: 2,
  //   });

  //   const allLocations = await this.prisma.vps.findMany({
  //     where: { isActive: true, isVip: false },
  //     select: { uuid: true, id: true, name: true, location: { select: { region: true, name: true, flag: true } } },
  //     orderBy: { name: 'desc' },
  //   });

  //   if (timeZone === 'Asia/Tehran') {
  //     const vipvpss = await this.prisma.vps.findMany({
  //       where: { isActive: true, isVip: true },
  //       select: { isVip: true, uuid: true, id: true, name: true, location: { select: { region: true, name: true, flag: true } } },
  //       orderBy: { name: 'desc' },
  //     });

  //     return { allLocations, recommendedServerList: recommendedvpss, ...(vipvpss?.length && { vipServerList: vipvpss }) };
  //   }

  //   return { allLocations, recommendedServerList: recommendedvpss };
  // }
}
