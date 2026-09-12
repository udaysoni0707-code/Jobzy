const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure DATABASE_URL is always set (defaults to SQLite dev.db)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

console.log('--------------------------------------------------');
console.log('🚀 Jobzy Production Build');
console.log(`📦 DATABASE_URL: ${process.env.DATABASE_URL}`);
console.log(`📦 NODE_ENV: ${process.env.NODE_ENV || 'production'}`);
console.log('--------------------------------------------------');

const projectRoot = path.resolve(__dirname, '..');

function run(command, description) {
  console.log(`\n▶️  ${description}...`);
  try {
    execSync(command, {
      cwd: projectRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });
  } catch (error) {
    console.error(`❌ Failed at: ${description}`);
    throw error;
  }
}

try {
  // 1. Generate Prisma Client
  run('npx prisma generate', 'Generating Prisma Client');

  // 2. Push Schema to Database (ensures tables exist)
  run('npx prisma db push --accept-data-loss', 'Syncing Database Schema');

  // 3. Seed Database (idempotent / resets cleanly)
  run('npx tsx prisma/seed.ts', 'Seeding Initial Database Records');

  // 4. Next.js Production Build (clean cache first)
  const nextDir = path.join(projectRoot, '.next');
  if (fs.existsSync(nextDir)) {
    try {
      fs.rmSync(nextDir, { recursive: true, force: true });
    } catch {}
  }
  run('npx next build', 'Compiling Next.js Application');

  console.log('\n✅ Jobzy production build completed successfully!\n');
} catch (error) {
  console.error('\n💥 Build pipeline failed:', error.message || error);
  process.exit(1);
}
