/* eslint-disable prefer-const */

import { Injectable } from '@nestjs/common';

@Injectable()
export class TransformService {
  convertSpeedUnitStringToMBitsPS(value: string): number | null {
    const amount = value.split(' ')[0];
    const unit = value.split(' ')[1];

    if (unit === 'bit/s') {
      return Number(amount) / 1e6;
    }
    if (unit === 'kbit/s') {
      return Number(amount) / 1e3;
    }

    if (unit === 'Mbit/s') {
      return Number(amount);
    }

    if (unit === 'Gbit/s') {
      return Number(amount) * 1e3;
    }

    return;
  }
}
