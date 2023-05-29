import { Controller, Post, Body, Get, UseGuards, Query } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { TokenAuthService } from 'src/guards/token.auth/token.auth.service';
import { AccessTokenJwtAuthGuard } from 'src/guards/token.auth/guards/access.token.jwt.auth.guard';
import { GetClientAppVersionInfo, GetClientUniqueIds } from 'src/guards/token.auth/token.auth.decorator';
import { appVersionDto, clientDto, clientRegistrationDto } from 'src/guards/token.auth/token.auth.dto';
import { receiptIosDto, recheckReceiptIosDto, verifyAlreadyReceiptIosDto, verifyReceiptIosDto } from './subscription.dto';
import { SessionJwtAuthGuard } from 'src/guards/session.auth/guards/session.jwt.auth.guard';
import { SessionRole } from 'src/guards/rbac/role.enum';
import { SessionRoles } from 'src/guards/rbac/role.decorator';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // @UseGuards(AccessTokenJwtAuthGuard)
  // @Get('client')
  // async getClientSubscription(@GetClientUniqueIds() subscriberInfo: subscriberDto) {
  //   return this.subscriptionService.getClientSubscription(subscriberInfo);
  // }

  // @UseGuards(AccessTokenJwtAuthGuard)
  // @Get('subscriber')
  // async getSubscriberSubscription(@GetClientUniqueIds() subscriberInfo: subscriberDto) {
  //   return this.subscriptionService.getSubscriberSubscription(subscriberInfo);
  // }

  // @Post('validate/receipt/ios')
  // async validateReceiptIos(@Body() data: { transactionReceipt: string }) {
  //   return this.subscriptionService.validateReceiptIos(data.transactionReceipt);
  // }

  // @Post('check/receipt/ios')
  // async checkPurchaseReceiptIos(@Body() data: recheckReceiptIosDto) {
  //   return this.subscriptionService.checkPurchaseReceiptIos(data);
  // }

  // @Post('verify/receipt/ios')
  // async verifyPurchaseReceiptIos(@Body() data: receiptIosDto) {
  //   return this.subscriptionService.verifyPurchaseReceiptIos(data);
  // }
  // @Post('listen')
  // async listenToSubscriptionEvent(@Body() data: any) {
  //   return this.subscriptionService.listenToSubscriptionEvent(data);
  // }

  // @UseGuards(SessionJwtAuthGuard)
  // @SessionRoles(SessionRole.ADMIN)
  // @Post('plan')
  // async updateProducts(@Body() data: { purchaseMethod: string; name: string; identifier: string; durationInDayUnit?: number; id?: number }) {
  //   return this.subscriptionService.updatePlan(data);
  // }

  // @UseGuards(SessionJwtAuthGuard)
  // @SessionRoles(SessionRole.ADMIN)
  // @Get('plan')
  // async listProducts() {
  //   return this.subscriptionService.listPlans();
  // }

  // @UseGuards(SessionJwtAuthGuard)
  // @SessionRoles(SessionRole.ADMIN)
  // @Post('plan/default')
  // async setDefaultPlant(@Query('id') id) {
  //   return this.subscriptionService.setDefaultPlant(Number(id));
  // }

  // @Get('plan/default')
  // async getDefaultProduct() {
  //   return this.subscriptionService.getDefaultPlan();
  // }
}
