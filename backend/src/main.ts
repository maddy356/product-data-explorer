import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow local and deployed frontends via env
  // Example: CORS_ORIGIN="http://localhost:3000,https://your-frontend.onrender.com"
  const defaultOrigins = [
    'http://localhost:3000',
    'https://product-data-explorer-flax.vercel.app'
  ];
  const corsOrigin = (process.env.CORS_ORIGIN ?? defaultOrigins.join(','))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });

  // Render provides PORT; bind to 0.0.0.0
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  await app.listen(port, '0.0.0.0');

  console.log(
    `[BOOT] Backend listening on port ${port}. CORS origins: ${corsOrigin.join(', ')}`,
  );
}
bootstrap();