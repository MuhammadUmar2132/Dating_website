import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',

  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_change_in_prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  magicLinkSecret: process.env.MAGIC_LINK_SECRET || 'dev_magic_link_secret',
  magicLinkExpiresMinutes: parseInt(process.env.MAGIC_LINK_EXPIRES_MINUTES || '30', 10),

  appUrl: process.env.APP_URL || 'http://localhost:3000',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'Bea App <noreply@beaapp.com>',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  adminEmail: process.env.ADMIN_EMAIL || 'admin@beaapp.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'Admin@123456',

  databaseUrl: process.env.DATABASE_URL || '',
};
