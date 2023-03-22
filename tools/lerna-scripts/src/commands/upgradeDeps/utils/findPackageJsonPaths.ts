import globby from 'globby';

const findPackageJsonPaths = (): string[] => {
  // Находим все package.json
  const packageJsonPattern = '**/package.json';

  // Исключаем package.json в node_modules
  const excludeNodeModules = '!(**/node_modules/**/*)';

  // Исключаем package.json в public
  const excludePublic = '!(**/public/**/*)';

  return globby.sync([packageJsonPattern, excludeNodeModules, excludePublic], {
    absolute: true,
  });
};

export default findPackageJsonPaths;
