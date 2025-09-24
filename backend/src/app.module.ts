import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const url =
          process.env.DATABASE_URL ??
          `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}` +
            `@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT ?? 5432}/${process.env.POSTGRES_DB}`;

        const useSsl =
          (process.env.DB_SSL ?? '').toLowerCase() === 'true' ||
          (url ?? '').includes('sslmode=require');

        return {
          type: 'postgres',
          url,
          ssl: useSsl ? { rejectUnauthorized: false } : undefined,
          autoLoadEntities: true,
          // In prod, prefer migrations.
          synchronize: false,
        };
      },
    }),
    // ...your modules
  ],
})
export class AppModule {}
