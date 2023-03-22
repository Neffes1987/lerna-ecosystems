import { resolve as resolvePath } from 'path';

import fs from 'fs-extra';

export default async function clean(): Promise<void> {
  const targetDir = fs.realpathSync(process.cwd());
  await fs.remove(resolvePath('.npmrc'));
  await fs.remove(resolvePath(targetDir, 'build'));
  await fs.remove(resolvePath(targetDir, '.npmrc'));
  await fs.remove(resolvePath(targetDir, '.package.json-backup'));
}
