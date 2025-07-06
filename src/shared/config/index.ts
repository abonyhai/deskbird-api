import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const AppConfigModule = ConfigModule.forRoot({ isGlobal: true });

export const TypeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    let cfg: any;
    const useSsl = config.get('DATABASE_SSL') === 'true';
    if (config.get('DATABASE_URL')) {
      cfg = {
        type: 'postgres',
        url: config.get('DATABASE_URL'),
        ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
        autoLoadEntities: true,
        synchronize: process.env.IS_PRODUCTION !== 'true', // Set to false in production
      };
    } else {
      cfg = {
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT'), 10) || 5432,
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_DATABASE'),
        ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
        autoLoadEntities: true,
        synchronize: process.env.IS_PRODUCTION !== 'true', // Set to false in production
      };
    }
    console.log('TypeORM config:', cfg);
    return cfg;
  },
};
