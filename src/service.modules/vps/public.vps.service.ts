import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../package.modules/prisma/prisma.service';
import * as https from 'https';
import axios from 'axios';
import { pipeline } from 'node:stream/promises';
import { AxiosService } from 'src/package.modules/axios/axios.service';
import { join } from 'path';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { mkdir } from 'fs/promises';

@Injectable()
export class PublicVpsService {
  constructor(private prisma: PrismaService, private axiosService: AxiosService) {}
  private uploadDirPath = join(__dirname, `../../uploads`);
  async listPublicVps(): Promise<any> {
    return this.prisma.vpnGateVps.findMany({ select: { uuid: true, id: true, countryName: true, createdAt: true, flagImage: true, ip: true }, orderBy: { score: 'desc' }, take: 30 });
  }

  async getVPNGateServers(): Promise<any> {
    if (!(await this.checkUploadPath())) {
      throw new CommonException({ message: 'invalid directory' }, HttpStatus.FORBIDDEN);
    }
    const baseURL = 'http://www.vpngate.net';
    const url = '/api/iphone/';
    const servers = await this.axiosService.createRequest({ baseURL, url, method: 'GET' });

    const serversLines = servers.split('\n').slice(2);

    const serverInfo = await Promise.all(
      serversLines.map(async (server: string) => {
        if (!server) {
          return null;
        }
        const info = server.split(',');
        if (info[1] && info[2] && info[5] && info[6] && info[14]) {
          const countryName: string = info[5];
          const countryShortName: string = info[6]?.toLowerCase();

          const flagImage = await new Promise<string | null | void>(async (resolve) => {
            try {
              const imagePath = `uploads/images/flags/${countryShortName}.png`;
              if (existsSync(join(__dirname, `../../${imagePath}`))) {
                return resolve(imagePath);
              }
              console.log('download >>>>>>>>>>>');

              await this.downloadFile(`https://flagcdn.com/w80/${countryShortName}.png`, join(__dirname, `../../uploads/images/flags`), `${countryShortName}.png`);
              return resolve(imagePath);
            } catch (error) {
              return resolve();
            }
          });

          const serverInfo = {
            ip: info[1] as string,
            score: Number(info[2]),
            countryName,
            profile: info[14] as string,

            ...(flagImage && {
              flagImage,
            }),
          };
          const savedServer = await this.prisma.vpnGateVps.upsert({
            where: { ip: serverInfo.ip },
            update: serverInfo,
            create: { ...serverInfo },
          });

          return savedServer;
        }
        return null;
      })
    );

    return serverInfo.filter((_) => _);
  }

  async downloadFile(fileUrl: string, path: string, fileName: string): Promise<any> {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
      const timeout = 6000;
      const request = await axios.get(fileUrl, { httpsAgent, responseType: 'stream', timeout });
      await pipeline(request.data, createWriteStream(`${path}/${fileName}`));

      // console.log('download pdf pipeline successful');
      return Promise.resolve(true);
    } catch (error) {
      // console.error("download pdf pipeline failed", error);
      return Promise.resolve(false);
    }
  }

  async checkUploadPath(): Promise<any> {
    try {
      const uploadPath = this.uploadDirPath;
      const imagePath = `${this.uploadDirPath}/images`;
      const flagPath = `${this.uploadDirPath}/images/flags`;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      if (!existsSync(imagePath)) {
        mkdirSync(imagePath);
      }

      if (!existsSync(flagPath)) {
        mkdirSync(flagPath);
      }

      return Promise.resolve(true);
    } catch (error) {
      // console.error("download pdf pipeline failed", error);
      return Promise.resolve(false);
    }
  }
}
