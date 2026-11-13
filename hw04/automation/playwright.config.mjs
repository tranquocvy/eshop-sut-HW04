import { existsSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const repo = realpathSync(fileURLToPath(new URL('../../', import.meta.url)));
const runtime = process.env.HW04_SUT_ROOT;
const isListing = process.argv.includes('--list');
const api = 'http://localhost:3000/api';
const useWeb = process.env.HW04_FRONTEND === 'web';
const frontendDir = useWeb ? 'frontend-web' : 'frontend-admin';
const frontendPort = useWeb ? 5173 : 5174;
const frontend = `http://localhost:${frontendPort}`;

if (!isListing) {
  if (!runtime || !existsSync(join(runtime, '.hw04-isolated-runtime'))) {
    throw new Error('HW04_SUT_ROOT must identify an isolated EShop runtime.');
  }
  if (realpathSync(runtime) === repo ||
      realpathSync(join(runtime, 'backend')) === join(repo, 'backend') ||
      realpathSync(join(runtime, frontendDir)) === join(repo, frontendDir)) {
    throw new Error('Use a separate copy of the SUT for test fixtures.');
  }
}

export default defineConfig({
  testDir: 'tests',
  workers: 1,
  retries: 0,
  timeout: 30_000,
  forbidOnly: true,
  use: { baseURL: frontend, screenshot: useWeb ? 'only-on-failure' : 'off' },
  projects: ['chromium', 'firefox', 'webkit'].map(browserName => ({
    name: browserName,
    use: { browserName }
  })),
  webServer: isListing ? undefined : [
    {
      command: 'node server.js',
      cwd: join(runtime, 'backend'),
      url: api + '/categories',
      reuseExistingServer: false
    },
    {
      command: `node node_modules/vite/bin/vite.js --host localhost --port ${frontendPort} --strictPort`,
      cwd: join(runtime, frontendDir),
      url: frontend,
      reuseExistingServer: false
    }
  ]
});
