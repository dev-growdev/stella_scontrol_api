import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  readonly #salt: number = parseInt(process.env.BCRYPT_SALT);

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.#salt);
  }

  async compare(plainText: string, hashToCompare: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashToCompare);
  }
}
