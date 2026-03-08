const PMSPADS_CWD = process.env.PMSPADS_CWD || '/var/www/pmspads_com/backend';
const OPTIMALIST_CWD =
  process.env.OPTIMALIST_CWD || '/var/www/optimalist_be/backend';
const CLEANUP_DEPLOY_ROOT =
  process.env.CLEANUP_DEPLOY_ROOT || '/var/www/angular-cleanup-shop';

module.exports = {
  apps: [
    {
      name: 'pmspads',
      script: './main.js',
      cwd: PMSPADS_CWD,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: process.env.PMSPADS_NODE_ENV || 'development',
        API_URL: process.env.PMSPADS_API_URL || 'https://api.example.com',
        PORT: process.env.PMSPADS_PORT || 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        API_URL: process.env.PMSPADS_API_URL_PRODUCTION || '',
        PORT: process.env.PMSPADS_PORT_PRODUCTION || 8080,
        DB_HOST: process.env.PMSPADS_DB_HOST || '127.0.0.1',
        DB_PORT: process.env.PMSPADS_DB_PORT || 5432,
        DB_USER: process.env.PMSPADS_DB_USER || '',
        DB_PASSWORD: process.env.PMSPADS_DB_PASSWORD || '',
        DB_NAME: process.env.PMSPADS_DB_NAME || '',
        DB_LOGGING: process.env.PMSPADS_DB_LOGGING || 'true',
        DB_MIGRATE: process.env.PMSPADS_DB_MIGRATE || 'true',
        MAIL_HOST: process.env.PMSPADS_MAIL_HOST || '',
        MAIL_PORT: process.env.PMSPADS_MAIL_PORT || 587,
        MAIL_SECURE: process.env.PMSPADS_MAIL_SECURE || 'false',
        MAIL_DEFAULT: process.env.PMSPADS_MAIL_DEFAULT || '',
        MAIL_USER: process.env.PMSPADS_MAIL_USER || '',
        MAIL_PASSWORD: process.env.PMSPADS_MAIL_PASSWORD || '',
        MAIL_REJECT_UNAUTHORIZED:
          process.env.PMSPADS_MAIL_REJECT_UNAUTHORIZED || 'false',
      },
    },
    {
      name: 'optimalist',
      script: './main.js',
      cwd: OPTIMALIST_CWD,
      instances: 1,
      autorestart: true,
      watch: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: process.env.OPTIMALIST_NODE_ENV || 'development',
        API_URL: process.env.OPTIMALIST_API_URL || 'https://api.example.com',
        PORT: process.env.OPTIMALIST_PORT || 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: process.env.OPTIMALIST_PORT_PRODUCTION || 3001,
        DB_HOST: process.env.OPTIMALIST_DB_HOST || '127.0.0.1',
        DB_PORT: process.env.OPTIMALIST_DB_PORT || 5432,
        DB_USER: process.env.OPTIMALIST_DB_USER || '',
        DB_PASSWORD: process.env.OPTIMALIST_DB_PASSWORD || '',
        DB_NAME: process.env.OPTIMALIST_DB_NAME || '',
        DB_LOGGING: process.env.OPTIMALIST_DB_LOGGING || 'true',
        DB_MIGRATE: process.env.OPTIMALIST_DB_MIGRATE || 'true',
        MAIL_HOST: process.env.OPTIMALIST_MAIL_HOST || '',
        MAIL_PORT: process.env.OPTIMALIST_MAIL_PORT || 587,
        MAIL_SECURE: process.env.OPTIMALIST_MAIL_SECURE || 'false',
        MAIL_DEFAULT: process.env.OPTIMALIST_MAIL_DEFAULT || '',
        MAIL_USER: process.env.OPTIMALIST_MAIL_USER || '',
        MAIL_PASSWORD: process.env.OPTIMALIST_MAIL_PASSWORD || '',
        MAIL_REJECT_UNAUTHORIZED:
          process.env.OPTIMALIST_MAIL_REJECT_UNAUTHORIZED || 'false',
      },
    },
    {
      name: 'angular-cleanup-api',
      cwd: `${CLEANUP_DEPLOY_ROOT}/api`,
      script: './main.js',
      interpreter: 'node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.CLEANUP_API_PORT || 3333,
        CLEANUP_DB_PATH:
          process.env.CLEANUP_DB_PATH ||
          `${CLEANUP_DEPLOY_ROOT}/shared/data/cleanup-shop.db`,
        SMTP_HOST: process.env.CLEANUP_SMTP_HOST || '',
        SMTP_PORT: process.env.CLEANUP_SMTP_PORT || 587,
        SMTP_SECURE: process.env.CLEANUP_SMTP_SECURE || 'false',
        SMTP_USER: process.env.CLEANUP_SMTP_USER || '',
        SMTP_PASS: process.env.CLEANUP_SMTP_PASS || '',
        SMTP_FROM_EMAIL: process.env.CLEANUP_SMTP_FROM_EMAIL || '',
        SMTP_FROM_NAME:
          process.env.CLEANUP_SMTP_FROM_NAME || 'Angular Cleanup Shop',
        SMTP_REPLY_TO: process.env.CLEANUP_SMTP_REPLY_TO || '',
        SMTP_NOTIFICATION_EMAIL:
          process.env.CLEANUP_SMTP_NOTIFICATION_EMAIL || '',
      },
    },
    {
      name: 'angular-cleanup-shop-ssr',
      cwd: `${CLEANUP_DEPLOY_ROOT}/shop`,
      script: './server/server.mjs',
      interpreter: 'node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      time: true,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.CLEANUP_SHOP_SSR_PORT || 4000,
      },
    },
  ],
};
