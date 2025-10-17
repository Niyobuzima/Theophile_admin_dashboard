import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as mongoSanitize from 'express-mongo-sanitize';

@Injectable()
export class SanitizePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body' && typeof value === 'object') {
      return this.sanitizeObject(value);
    }
    return value;
  }

  private sanitizeObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    // Remove $ and . from keys (prevents NoSQL injection)
    const sanitized = mongoSanitize.sanitize(obj, { replaceWith: '_' });

    // Strip HTML tags from string values (prevents XSS)
    Object.keys(sanitized).forEach((key) => {
      if (typeof sanitized[key] === 'string') {
        sanitized[key] = this.stripHtml(sanitized[key]);
      }
    });

    return sanitized;
  }

  private stripHtml(str: string): string {
    return str.replace(/<[^>]*>/g, '');
  }
}
