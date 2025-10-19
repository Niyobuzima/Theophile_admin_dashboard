import { Injectable } from '@nestjs/common';
import { createHash, sign, constants } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor(private readonly config: ConfigService) {
    const privatePath = this.config.get<string>('PRIVATE_KEY_PATH');
    const publicPath = this.config.get<string>('PUBLIC_KEY_PATH');

    this.privateKey = readFileSync(privatePath, 'utf8');
    this.publicKey = readFileSync(publicPath, 'utf8');
  }

  hashEmail(email: string): string {
    return createHash('sha384').update(email).digest('hex');
  }

  signHash(hash: string): string {
    const signature = sign('sha256', Buffer.from(hash), {
      key: this.privateKey,
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: 32,
    });
    return signature.toString('base64');
  }

  getPublicKey(): string {
    return this.publicKey;
  }
}
