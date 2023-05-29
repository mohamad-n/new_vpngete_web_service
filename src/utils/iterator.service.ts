import { Injectable } from '@nestjs/common';

@Injectable()
export class IteratorService {
  //   constructor(
  //     private readonly UserAuthService: UserAuthService,
  //     private readonly jwtService: JwtService,
  //   ) {}
  async runInSequence(array: any[], fn: Function): Promise<any> {
    const arr: any[] = [];

    await array.reduce(async (previousValue: any, currentValue, currentIndex) => {
      arr.push(await previousValue);
      //   console.log(currentValue);

      if (currentIndex + 1 === array?.length) {
        return;
      }
      return fn(array[currentIndex + 1]);
    }, Promise.resolve(await fn(array[0])));

    return arr;
  }
}
