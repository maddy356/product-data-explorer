import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // allow frontend http://localhost:3000 to call backend http://localhost:3001
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  await app.listen(3001); // ✅ backend runs on port 3001
}
bootstrap();