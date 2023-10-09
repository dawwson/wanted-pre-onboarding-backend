import { registerAs } from '@nestjs/config';

export default registerAs('server', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.SERVER_PORT || '3000',
}));
