import { DataSource } from 'typeorm';
import { User } from './src/resources/user/entities/user.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const config = process.env.DATABASE_URL
  ? {
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: { rejectUnauthorized: false },
    };

console.log('TypeORM config:', config);

export default new DataSource({
  type: 'postgres',
  ...config,
  entities: [User],
  migrations: ['migrations/*.ts'],
  synchronize: false,
});
