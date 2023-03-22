import { assert } from './assert';
import type { PackageJson } from './types';

export function normalizePackageName(name: string): string {
  return name.replace('/', '__');
}

export function getPackage(packagePath: string) {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const packageJson = require(packagePath) as PackageJson;
  const { name } = packageJson;
  assert(
    name,
    `Package MUST have a name but ${packagePath} doesn't provide it`,
  );
  const normalizedName = normalizePackageName(name);
  return {
    ...packageJson,
    name,
    get normalizedName() {
      // таким образом оно будет не emunarable и не попадёт в JSON при стрингификации
      return normalizedName;
    },
  };
}
