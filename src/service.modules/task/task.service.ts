import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { Prisma } from '@prisma/client';
import configuration from 'src/config/configuration';
import * as moment from 'moment';
import { AxiosService } from 'src/package.modules/axios/axios.service';
import { PrismaService } from 'src/package.modules/prisma/prisma.service';
import cryptoTool from 'src/utils/crypto.tool';
import delay from 'src/utils/delay';
import { IteratorService } from 'src/utils/iterator.service';
import { TransformService } from 'src/utils/transform.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService, private iterator: IteratorService, private axiosService: AxiosService, private transformService: TransformService) {}

  //------ every 5 min ------
  // @Interval(300000)
  // async getServersInfo() {
  //   if (process.env.NODE_ENV === 'development') {
  //     return;
  //   }
  //   const allVph = await this.prisma.vph.findMany({ where: { isActive: true, scannable: true } });

  //   await this.iterator.runInSequence(allVph, async (vph: Vph) => {
  //     try {
  //       const baseURL = `http://${vph.ip}:${vph.port}`;
  //       const url = '/api/account';
  //       const secret = await cryptoTool.encrypt({ expireTime: moment().add(configuration().RECEIVED_WINDOW_TIMEOUT, 's').utc() }, vph.key);
  //       const headers = {
  //         secret,
  //         'Content-Type': 'application/json',
  //       };

  //       const { result } = await this.axiosService.createRequest({ method: 'GET', baseURL, url, headers });

  //       if (!result || typeof result !== 'object') {
  //         return;
  //       }

  //       const getNetInfo = (networkInfo: { networkSpeed: { rx: string; tx: string }; trafficInfo: { rx: number; tx: number } }) => {
  //         return {
  //           txSpeed: this.transformService.convertSpeedUnitStringToMBitsPS(networkInfo?.networkSpeed?.tx),
  //           rxSpeed: this.transformService.convertSpeedUnitStringToMBitsPS(networkInfo?.networkSpeed?.rx),
  //           rxTraffic: networkInfo?.trafficInfo?.rx,
  //           txTraffic: networkInfo?.trafficInfo?.tx,
  //         };
  //       };

  //       const netInfo = getNetInfo(result);
  //       await this.prisma.vphReport.upsert({
  //         where: { vphId: vph.id },
  //         update: { ...netInfo },
  //         create: { ...netInfo, vph: { connect: { id: vph.id } } },
  //       });
  //       await delay(1000);

  //       return;
  //     } catch (error) {
  //       console.log('error on getting or updating vps network info : ip =>  ', vph.ip, error);

  //       return;
  //     }
  //   });
  // }
}

// 2.43 kbit/s
// {
//     "networkSpeed": {
//         "rx": "12.69 Mbit/s",
//         "tx": "12.64 Mbit/s"
//     },
//     "trafficInfo": {
//         "rx": 504087223006,
//         "tx": 489210383509
//     }
// }

// "networkSpeed": {
//     "rx": "172 bit/s",
//     "tx": "86 bit/s"
// }

// "networkSpeed": {
//     "rx": "24.29 Mbit/s",
//     "tx": "25.36 Mbit/s"
// }
