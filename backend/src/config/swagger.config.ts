import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Admin Dashboard API')
  .setDescription(
    'Full-Stack JavaScript Developer Test - Admin panel with cryptographic signatures and Protocol Buffer data export',
  )
  .setVersion('1.0')
  .addTag('users', 'User CRUD operations with cryptographic signatures')
  .addTag('crypto', 'Cryptographic operations (RSA-PSS, SHA-384)')
  .addTag('analytics', 'Analytics and reporting endpoints')
  .addServer('http://localhost:3001', 'Development server')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token (if authentication is enabled)',
    },
    'JWT',
  )
  .build();

export const swaggerOptions = {
  customSiteTitle: 'Admin API Docs',
  customfavIcon: 'https://nestjs.com/img/logo-small.svg',
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { font-size: 2.5em; }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
};
