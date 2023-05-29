import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../package.modules/prisma/prisma.service';
import { CommonException } from 'src/interceptors/exception/error.interceptor';
import { RandomService } from 'src/utils/random';
import cryptoTool from 'src/utils/crypto.tool';
import * as moment from 'moment';
// import { clientAuthDto } from 'src/guards/token.auth/auth/client.auth.dto';
import { TokenAuthService } from 'src/guards/token.auth/token.auth.service';
import configuration from 'src/config/configuration';
import { appVersionDto, clientDto, clientRegistrationDto } from 'src/guards/token.auth/token.auth.dto';
import { DeviceOS, Prisma } from '@prisma/client';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { receiptIosDto, recheckReceiptIosDto, verifyAlreadyReceiptIosDto, verifyReceiptIosDto } from './subscription.dto';
import { AxiosService } from 'src/package.modules/axios/axios.service';
import { ClientService } from '../client/client.service';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService, private axiosService: AxiosService, private clientService: ClientService) {}
}
