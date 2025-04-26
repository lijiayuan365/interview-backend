import { Injectable } from '@nestjs/common';

@Injectable()
export class BigDataService {
  async getBigData() {
    // const length = 100;
    const length = 100000;
    const list = new Array(length).fill(0).map((_, i) => {
      return {
        id: i,
        name: `name${i}`,
        age: i,
      };
    });
    return { list };
  }
}
