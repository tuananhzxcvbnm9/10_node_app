import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const requests = new Map<string, { count: number; resetAt: number }>();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000);
  const rateLimitMax = Number(process.env.RATE_LIMIT_MAX ?? 120);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost'],
    credentials: true,
  });

  app.use((req: any, res: any, next: () => void) => {
    const key = req.ip ?? 'unknown';
    const now = Date.now();
    const state = requests.get(key) ?? { count: 0, resetAt: now + rateLimitWindowMs };
    if (now > state.resetAt) {
      state.count = 0;
      state.resetAt = now + rateLimitWindowMs;
    }
    state.count += 1;
    requests.set(key, state);
    if (state.count > rateLimitMax) {
      res.status(429).json({ message: 'Too many requests' });
      return;
    }
    const start = Date.now();
    res.on('finish', () => {
      console.log(JSON.stringify({
        level: 'info',
        service: process.env.APP_NAME ?? 'app-02',
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
      }));
    });
    next();
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));

  const config = new DocumentBuilder()
    .setTitle('Inventory System API')
    .setDescription('Production-ready API docs for app-02')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
}

bootstrap();
