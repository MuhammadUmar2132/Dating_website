import app from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

async function bootstrap() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected');

    const server = app.listen(env.port, () => {
      console.log(`
  ╔═══════════════════════════════════════════╗
  ║          🚀 Bea Backend Server            ║
  ╠═══════════════════════════════════════════╣
  ║  Port:    ${env.port}                         ║
  ║  Env:     ${env.nodeEnv.padEnd(10)}                ║
  ║  URL:     http://localhost:${env.port}          ║
  ╠═══════════════════════════════════════════╣
  ║  API Routes:                              ║
  ║  POST /api/auth/login                     ║
  ║  POST /api/waitlist/join                  ║
  ║  GET  /api/leaderboard                    ║
  ║  GET  /api/ambassador/dashboard           ║
  ║  GET  /api/admin/analytics                ║
  ║  GET  /health                             ║
  ╚═══════════════════════════════════════════╝
      `);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n⚡ ${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('✅ Server closed. Database disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
