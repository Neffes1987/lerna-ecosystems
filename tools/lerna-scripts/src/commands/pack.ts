#!/usr/bin/env node

import path from 'path';

import fs from 'fs-extra';

const SKIPPED_KEYS = ['access', 'registry', 'tag'];

const PACKAGE_PATH = 'package.json';
//  backup package json для того чтобы записать снова его в package json после publish
const PACKAGE_BACKUP_PATH = 'package.json-backup';

export const prePack = async () => {
  const pkgPath = path.resolve(PACKAGE_PATH);
  const pkgContent = await fs.readFile(pkgPath, 'utf8');
  const pkg = JSON.parse(pkgContent);
  await fs.writeFile(PACKAGE_BACKUP_PATH, pkgContent);

  // eslint-disable-next-line  no-restricted-syntax
  for (const key of Object.keys(pkg.publishConfig || {})) {
    if (!SKIPPED_KEYS.includes(key)) {
      pkg[key] = pkg.publishConfig[key];
    }
  }
  await fs.writeJson(pkgPath, pkg, { encoding: 'utf8', spaces: 2 });
};

export const revertPack = async () => {
  const targetRunFile = path.resolve(PACKAGE_BACKUP_PATH);
  const runFileExists = fs.pathExistsSync(targetRunFile);
  if (runFileExists) {
    await fs.move(PACKAGE_BACKUP_PATH, PACKAGE_PATH, { overwrite: true });
  }
};
