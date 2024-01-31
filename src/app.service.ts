import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healthCheck(): string {
    return JSON.stringify({
      message: 'Server is up',
    });
  }
}
