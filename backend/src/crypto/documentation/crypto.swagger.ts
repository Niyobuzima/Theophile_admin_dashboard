import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiProduces } from '@nestjs/swagger';

export const GetPublicKeyDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get RSA public key',
      description:
        'Returns the RSA-PSS public key in PEM format for signature verification on the frontend using Web Crypto API.',
    }),
    ApiProduces('text/plain'),
    ApiResponse({
      status: 200,
      description: 'RSA public key in PEM format (2048-bit)',
      content: {
        'text/plain': {
          schema: {
            type: 'string',
            example: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----`,
          },
        },
      },
    }),
  );
