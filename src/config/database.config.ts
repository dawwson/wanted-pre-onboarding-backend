import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '1234',
  dialect: process.env.DATABASE_DIALECT || 'postgres',
}));
