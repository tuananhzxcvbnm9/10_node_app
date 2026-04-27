import { Controller, Get, Header } from '@nestjs/common';

@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', 'text/plain; version=0.0.4; charset=utf-8')
  getMetrics() {
    const mem = process.memoryUsage().rss;
    return [
      '# HELP app_up Application up status',
      '# TYPE app_up gauge',
      'app_up 1',
      '# HELP app_memory_rss_bytes Resident memory size in bytes',
      '# TYPE app_memory_rss_bytes gauge',
      `app_memory_rss_bytes ${mem}`,
      '# HELP app_uptime_seconds Process uptime in seconds',
      '# TYPE app_uptime_seconds counter',
      `app_uptime_seconds ${Math.floor(process.uptime())}`,
    ].join('\n');
  }
}
