import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPackageManagerVersion } from 'nx/src/utils/package-manager.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cwd =  process.argv[2] === '--before' ? join(__dirname, 'a') : join(__dirname, 'b');
console.log('>>> using', cwd);

let version;
for (let i=0; i<100; i++) {
  version = getPackageManagerVersion('npm', cwd);
}
console.log(version);
