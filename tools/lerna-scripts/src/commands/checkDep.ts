import path from 'path';

import fs from 'fs-extra';
import globby from 'globby';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import values from 'lodash/values';

import { getPackage } from '../utils/getPackage';
import { StringMap } from '../utils/types/package.json.typings';

process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

const shouldFix = process.argv.includes('--fix');
const shouldIgnoreLegacy = process.argv.includes('--legacy');

const ignoredLegacy = ['edu', 'core', 'uikit'];
const ignoredInnerDeps = [
  'console',
  'core-js',
  'nouislider',
  'dnd-core',
  'highlight.js',
  'yaml',
  'pretty-format',
  '@components/lerna-scripts/configs',
];
const knownPeers = [
  'react',
  'react-dom',
  'react-router',
  'react-router-dom',
  'react-intl',
  'styled-components',
];

const findImports = (patterns: string[]) => {
  const noStoriesGlob = '!**/*.stories.*';
  const noStoriesDir = '!**/stories/*';
  const noTestGlob = '!**/*.test.*';
  const requiredModules: Record<string, string[]> = {};
  const filepaths: string[] = [];
  const addModule = (modulePath: string, value: string) => {
    if (value[0] !== '/' && value[0] !== '.') {
      requiredModules[modulePath].push(value);
    }
  };

  patterns.forEach((pattern) => {
    filepaths.push(
      ...globby.sync([pattern, noStoriesGlob, noTestGlob, noStoriesDir], {
        absolute: true,
      }),
    );
  });

  filepaths.forEach((filepath) => {
    const stat = fs.statSync(filepath);
    if (!stat.isFile()) {
      return;
    }
    const modulePath = path.relative(process.cwd(), filepath);

    try {
      const result = fs.readFileSync(filepath, 'utf-8');
      requiredModules[modulePath] = [];

      const patternImport = new RegExp(
        /(?<!.*\/\/.*|^[ ]*\*.*)import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*$/,
        'mg',
      );
      const patternDImport = new RegExp(
        /(?<!.*\/\/.*|^[ ]*\*.*)import\((?:["'\s]*\s*)?(.*([@\w_-]+))["'\s].*\);$/,
        'mg',
      );
      Array.from(result.matchAll(patternImport)).forEach(([, , importModule]) =>
        addModule(modulePath, importModule),
      );

      Array.from(result.matchAll(patternDImport)).forEach(([, importModule]) =>
        addModule(modulePath, importModule),
      );
    } catch (err) {
      console.error(`Error in \`${modulePath}\`: ${err}`);
    }
  });

  return uniq(flatten(values(requiredModules)));
};

function fixMissplacedTypes(
  name: string,
  dependencies: StringMap,
  peerDependencies: StringMap,
  devDependencies: StringMap,
) {
  const missplacedTypes = [
    ...Object.keys(dependencies).filter(
      (el): el is string => typeof el === 'string' && el.startsWith('@types/'),
    ),
    ...Object.keys(peerDependencies).filter(
      (el): el is string => typeof el === 'string' && el.startsWith('@types/'),
    ),
  ];
  if (missplacedTypes.length === 0) return;
  console.warn(
    `В модуле ${name} неправильно размещены пакеты:\n  ${missplacedTypes.join(
      '\n  ',
    )}.`,
  );

  if (!shouldFix) return console.warn(`Нужно пренести в devDependencies`);

  console.info('Фиксим ссылки на @types/');
  missplacedTypes.forEach((type) => {
    const version = dependencies[type] || peerDependencies[type] || '*';

    if (Reflect.has(dependencies, type)) {
      delete dependencies[type];
    }
    if (Reflect.has(peerDependencies, type)) {
      delete peerDependencies[type];
    }

    devDependencies[type] = version;
  });
}

function fixMissplacedPeers(
  name: string,
  dependencies: StringMap,
  peerDependencies: StringMap,
  // devDependencies: StringMap,
) {
  const missplacedPeers = Object.keys(dependencies).filter(
    (el): el is string => typeof el === 'string' && knownPeers.includes(el),
  );
  if (missplacedPeers.length === 0) return;
  console.warn(
    `В модуле ${name} неправильно размещены пакеты:\n  ${missplacedPeers.join(
      '\n  ',
    )}.`,
  );

  if (!shouldFix)
    return console.warn(
      `Нужно пренести в peerDependencies и продублировать в devDependencies`,
    );

  console.info('Фиксим ссылки на известные peers');
  missplacedPeers.forEach((peer) => {
    const version = dependencies[peer] || '*';

    if (Reflect.has(dependencies, peer)) {
      delete dependencies[peer];
    }

    peerDependencies[peer] = version;
    // devDependencies[peer] = version;
  });
}
function fixMissingDeps(
  name: string,
  dependencies: StringMap,
  peerDependencies: StringMap,
  devDependencies: StringMap,
) {
  const srcGlob = `src/**/*.{tsx,ts}`;
  const findedImports = findImports([srcGlob]);

  const deps = findedImports.reduce<string[]>((acc, importPath) => {
    const depPath =
      importPath[0] === '@'
        ? importPath.split('/').slice(0, 2).join('/')
        : importPath.split('/')[0];
    if (!acc.includes(depPath)) {
      acc.push(depPath);
    }
    return acc;
  }, []);

  const missingDeps = deps.filter(
    (dep) =>
      !dependencies[dep] &&
      !peerDependencies[dep] &&
      !devDependencies[dep] &&
      !ignoredInnerDeps.includes(dep) &&
      (!shouldIgnoreLegacy || ignoredLegacy.includes(dep)),
  );

  if (missingDeps.length === 0) return [];
  if (!shouldFix) return missingDeps;

  console.info(
    `В модуле ${name} пропущены следующие зависимости:\n  ${missingDeps.join(
      '\n  ',
    )}`,
  );
  console.info('Попробуем пофиксить');
  const depLeft = missingDeps.reduce<string[]>((left, dep) => {
    if (dep.startsWith('@components')) {
      dependencies[dep] = '^0.0.1';
      return left;
    }
    if (knownPeers.includes(dep)) {
      peerDependencies[dep] = '*';
      devDependencies[dep] = '*';
      return left;
    }

    return [...left, dep];
  }, []);

  return depLeft;
}

export default async (): Promise<void> => {
  const pkgPath = path.resolve(process.cwd(), './package.json');

  const pkg = getPackage(pkgPath);

  const {
    dependencies = {},
    peerDependencies = {},
    devDependencies = {},
  } = pkg;
  fixMissplacedTypes(pkg.name, dependencies, peerDependencies, devDependencies);
  fixMissplacedPeers(
    pkg.name,
    dependencies,
    peerDependencies /* devDependencies */,
  );
  const depLeft = fixMissingDeps(
    pkg.name,
    dependencies,
    peerDependencies,
    devDependencies,
  );
  pkg.dependencies = dependencies;
  pkg.peerDependencies = peerDependencies;
  pkg.devDependencies = devDependencies;

  const message = `В модуль ${
    pkg.name
  } нужно добавить зависимости на:\n  "${depLeft.join('"\n  "')}"\n${pkgPath}`;
  if (!shouldFix) {
    if (depLeft.length > 0) throw new Error(message);
    return console.info(`Все зависимости модуля ${pkg.name} указаны верно`);
  }

  // удаляем normalizedName из объекта, что бы не серриализовать лишнее в файл
  // это свойство, которое было добавлено для удобства packageLoader
  delete (pkg as any).normalizedName;

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  if (depLeft.length > 0) throw new Error(message);
  return console.info(`Все завсимости модуля ${pkg.name} удалось пофиксить`);
};
