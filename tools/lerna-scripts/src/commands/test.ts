#!/usr/bin/env node

import * as os from 'os';
import path from 'path';

import { Command } from 'commander';

function isIncludesOwnConfig(args: string[], ...params: string[]): boolean {
  // eslint-disable-next-line  no-restricted-syntax
  for (const param of params) {
    if (args.includes(param)) {
      return true;
    }
  }
  return false;
}

export default async (cmd: Command): Promise<void> => {
  async function test(): Promise<void> {
    // для корректного резолвинга babel env test перезаписываем process.env.NODE_ENV
    if (process.env.NODE_ENV !== 'test') {
      process.env.NODE_ENV = 'test';
    }

    if (process.env.BABEL_ENV !== 'test') {
      process.env.BABEL_ENV = 'test';
    }
    // все аргументы переданные в jest
    const rawArgs = cmd.parent.rawArgs as string[];
    const args = rawArgs.slice(rawArgs.indexOf('test') + 1);

    if (!isIncludesOwnConfig(args, '-c', '--config')) {
      args.push(
        '--config',
        path.resolve(path.resolve(__dirname, '../../../..'), 'jest.package.js'),
      );
    }

    args.push('--passWithNoTests');
    args.push(`--maxWorkers=${os.cpus().length - 1 || 1}`);

    // запуск jest  c переданными параметрами и путем до конфига (jest.package.js в корне проекта)
    // eslint-disable-next-line
    await require('jest').run(args);
  }

  return test();
};
