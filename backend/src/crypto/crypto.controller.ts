import { Controller, Get, Header } from '@nestjs/common';
import { ApiTags, ApiProduces } from '@nestjs/swagger';
import { CryptoService } from './crypto.service';
import { GetPublicKeyDocs } from './documentation/crypto.swagger';

@ApiTags('crypto')
@Controller('keys')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('public')
  @Header('Content-Type', 'text/plain')
  @ApiProduces('text/plain')
  @GetPublicKeyDocs()
  getPublicKey(): string {
    return this.cryptoService.getPublicKey();
  }
}
