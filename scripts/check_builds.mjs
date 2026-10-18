import { execSync } from 'child_process';
import path from 'path';

const projects = [
  { name: 'Storefront (root)', dir: process.cwd() },
  { name: 'Admin Portal (admin/)', dir: path.join(process.cwd(), 'admin') },
  { name: 'App (app/)', dir: path.join(process.cwd(), 'app') }
];

const results = [];

for (const p of projects) {
  console.log(`\n========================================`);
  console.log(`Checking build for: ${p.name}`);
  console.log(`Directory: ${p.dir}`);
  console.log(`========================================`);
  const startTime = Date.now();
  try {
    const output = execSync('npm run build', {
      cwd: p.dir,
      encoding: 'utf8',
      stdio: 'pipe'
    });
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`BUILD SUCCESS (${duration}s)`);
    console.log(output.trim().split('\n').slice(-5).join('\n'));
    results.push({ name: p.name, exitCode: 0, status: 'SUCCESS', duration: `${duration}s` });
  } catch (error) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.error(`BUILD FAILED (${duration}s)`);
    console.error(error.stdout || '');
    console.error(error.stderr || '');
    results.push({ name: p.name, exitCode: error.status || 1, status: 'FAILED', duration: `${duration}s`, error: error.message });
  }
}

console.log(`\n========================================`);
console.log(`BUILD SUMMARY`);
console.log(`========================================`);
console.table(results);

const allSuccess = results.every(r => r.exitCode === 0);
if (!allSuccess) {
  process.exit(1);
} else {
  console.log('\nAll 3 project builds completed with EXIT CODE 0.');
}
