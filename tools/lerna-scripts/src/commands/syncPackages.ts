#!/usr/bin/env node

import path from 'path';

import execa from 'execa';
import fs from 'fs-extra';

const getTsConfigBuild = (pathToConfigBuild: string) => ({
  extends: pathToConfigBuild,
  compilerOptions: {
    rootDir: './src',
    baseUrl: './src',
    outDir: 'build',
    lib: ['es2015', 'es2016', 'es2017', 'esnext', 'dom', 'es2020'],
  },
  include: ['src'],
  exclude: ['**/*.stories.*', '**/*.test.ts', '**/*.test.tsx'],
});

const publishConfig = {
  access: 'public',
  main: 'build/index.js',
  types: 'build/index.d.ts',
  type: 'git',
  registry: '',
};

function patchPackageJson(filePath: string): void {
  const pkg = JSON.parse(fs.readFileSync(`${filePath}/package.json`, 'utf-8'));

  if (fs.existsSync(`${filePath}/src/index.d.ts`)) {
    pkg.types = 'src/index.d.ts';
  } else {
    pkg.types = fs.existsSync(`${filePath}/src/index.tsx`)
      ? 'src/index.tsx'
      : 'src/index.js';
  }

  pkg.main = 'src/index';
  // pkg.types = 'build/index.d.ts';
  // pkg.main = 'build/index.js';
  pkg.private = true;
  //pkg.publishConfig = publishConfig;
  fs.writeFileSync(
    `${filePath}/package.json`,
    `${JSON.stringify(pkg, null, 2)}\n`,
  );
}

async function patchPackages(
  rootDir: string,
  pakagesDir: string,
): Promise<void> {
  const exists = await fs.pathExists(pakagesDir);
  if (!exists) {
    return;
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const dir of fs.readdirSync(pakagesDir)) {
    if (['v3', 'v2', 'ui'].includes(dir)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const pathToTsConfigBuild = path.relative(
      `${pakagesDir}/${dir}`,
      `${rootDir}/tsconfig.build.json`,
    );

    fs.writeFileSync(
      `${pakagesDir}/${dir}/tsconfig.build.json`,
      `${JSON.stringify(getTsConfigBuild(pathToTsConfigBuild), null, 2)}\n`,
    );
    patchPackageJson(`${pakagesDir}/${dir}`);
  }
}

export default async (): Promise<void> => {
  await execa(
    './node_modules/.bin/prettier',
    ['--write', './packages/**/*.json'],
    { cwd: process.cwd() },
  );
};
