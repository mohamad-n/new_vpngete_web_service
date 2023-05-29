/* eslint-disable prefer-const */

import { Injectable } from '@nestjs/common';

@Injectable()
export class RandomService {
  randHex(len: number): string {
    let r,
      n,
      max,
      min,
      maxlen = 8;
    min = Math.pow(16, Math.min(len, maxlen) - 1);
    (max = Math.pow(16, Math.min(len, maxlen)) - 1), (n = Math.floor(Math.random() * (max - min + 1)) + min), (r = n.toString(16));
    while (r.length < len) {
      r = r + this.randHex(len - maxlen);
    }
    return r.toUpperCase();
  }
  randNumber(len: number): string {
    const number = Math.floor(Math.random() * Math.pow(10, len));

    return number.toString();
  }
  randString(length: number, charset?: string): string {
    var charSet = charset || 'abcdefghijklmnopqrstuvwxyz1234567890',
      retVal = '';
    for (var i = 0, n = charSet.length; i < length; ++i) {
      retVal += charSet.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  randNumberString(length: number): string {
    var charset = '1234567890',
      retVal = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }
  generateVoucherCode(charLength: number, sections: number): string {
    return [...Array(sections).keys()]
      .map((_) => {
        return `${this.randString(charLength).toUpperCase()}`;
      })
      .join('-');
  }
}
