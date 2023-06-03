import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { TokenAuthService } from 'src/guards/token.auth/token.auth.service';
import { AccessTokenJwtAuthGuard } from 'src/guards/token.auth/guards/access.token.jwt.auth.guard';
import { GetClientAppVersionInfo, GetClientUniqueIds } from 'src/guards/token.auth/token.auth.decorator';
import { appVersionDto, clientDto, clientRegistrationDto, clientRegistrationWithVoucherDto } from 'src/guards/token.auth/token.auth.dto';
import { createVoucherDto, recheckReceiptIosDto, verifyAlreadyReceiptIosDto } from './subscription.dto';
import { SessionJwtAuthGuard } from 'src/guards/session.auth/guards/session.jwt.auth.guard';
import { SessionRole } from 'src/guards/rbac/role.enum';
import { SessionRoles } from 'src/guards/rbac/role.decorator';
import { GetUserUniqueId } from 'src/guards/session.auth/session.auth.decorator';
import { RolesGuard } from 'src/guards/rbac/role.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @UseGuards(AccessTokenJwtAuthGuard)
  @Get('client')
  async getClientSubscription(@Query('deviceSpecificId') deviceSpecificId, @GetClientUniqueIds() clientInfo: clientDto) {
    return this.subscriptionService.getClientSubscription(clientInfo, deviceSpecificId);
  }

  @UseGuards(SessionJwtAuthGuard, RolesGuard)
  @SessionRoles(SessionRole.AGENT)
  @Post('voucher')
  async createVoucher(@Body() data: createVoucherDto, @GetUserUniqueId() userCredential) {
    return this.subscriptionService.createVoucher(data, userCredential);
  }

  @UseGuards(AccessTokenJwtAuthGuard)
  @Get('voucher/consume')
  async consumeVoucherByClient(@Query('code') code, @Query('deviceSpecificId') deviceSpecificId, @GetClientUniqueIds() data: clientDto) {
    return this.subscriptionService.consumeVoucherByClient(data, code, deviceSpecificId);
  }

  @Post('voucher/consume/anonymous')
  async consumeVoucherByAnonymous(@Body() registrationData: clientRegistrationWithVoucherDto) {
    return this.subscriptionService.consumeVoucherByAnonymous(registrationData);
  }
}
