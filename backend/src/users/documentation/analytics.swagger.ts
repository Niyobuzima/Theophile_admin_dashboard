import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DailyStatsDto } from '../dto/user-response.dto';

export const GetDailyAnalyticsDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get daily user creation statistics',
      description:
        'Returns the number of users created per day for the last 7 days. No rate limiting.',
    }),
    ApiResponse({
      status: 200,
      description: 'Array of daily statistics (7 days)',
      type: [DailyStatsDto],
      example: [
        { date: '2025-10-08', count: 2 },
        { date: '2025-10-09', count: 5 },
        { date: '2025-10-10', count: 3 },
        { date: '2025-10-11', count: 0 },
        { date: '2025-10-12', count: 7 },
        { date: '2025-10-13', count: 4 },
        { date: '2025-10-14', count: 1 },
      ],
    }),
  );
