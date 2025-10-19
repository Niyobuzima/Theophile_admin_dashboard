# Swagger/OpenAPI (Minimal Guide)

Access UI: http://localhost:3001/api-docs
Spec JSON: http://localhost:3001/api-docs-json

## Enable (in `src/main.ts` before `app.listen()`)
```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const config = new DocumentBuilder()
  .setTitle('Admin Dashboard API')
  .setDescription('Full-Stack Test')
  .setVersion('1.0')
  .addTag('users')
  .addTag('crypto')
  .addTag('analytics')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);
```

## Decorators (examples)
```typescript
@ApiTags('users')
@ApiOperation({ summary: 'Create user' })
@ApiResponse({ status: 201, description: 'User created' })
@ApiBody({ type: CreateUserDto })
```

## Common DTO Pattern
```typescript
export class CreateUserDto {
  @ApiProperty({ example: 'alice@example.com' })
  email: string;
  @ApiProperty({ example: 'user', enum: ['admin','user'], required: false })
  role?: string;
  @ApiProperty({ example: 'active', enum: ['active','inactive'], required: false })
  status?: string;
}
```

## Try It Out
1. `npm run start:dev`
2. Open `/api-docs`
3. Expand endpoint → Try it out → Execute

## Export Spec
```bash
curl http://localhost:3001/api-docs-json > openapi.json
```

## Client Generation (TS Axios)
```bash
npx @openapitools/openapi-generator-cli generate \
  -i openapi.json -g typescript-axios -o ./generated-client
```

## Tips
- Use `@ApiProduces('application/octet-stream')` for protobuf export.
- Use `@ApiResponse({ status: 429, description: 'Rate limit exceeded' })` where throttling applies.
- Keep examples short & realistic.

## Minimal Benefits
Interactive docs • Consistent types • Easy client generation.

## Future Enhancements

- [ ] Add request/response examples from real data
- [ ] Document authentication flows when JWT is added
- [ ] Add more detailed protobuf documentation
- [ ] Include signature verification workflow diagrams
- [ ] Add API versioning
- [ ] Include webhook documentation (if added)

## Maintenance

When adding new endpoints:
1. Add `@ApiTags()` at controller level
2. Add `@ApiOperation()` to each method
3. Add `@ApiResponse()` for all status codes
4. Create response DTOs with `@ApiProperty()`
5. Document all parameters and bodies
6. Include example values

## Resources

- [NestJS Swagger Module](https://docs.nestjs.com/openapi/introduction)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Specification](https://swagger.io/specification/)

---
