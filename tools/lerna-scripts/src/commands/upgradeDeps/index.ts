import { Command } from 'commander';

import createConfig from './utils/createConfig';
import createPackageJsonHandler from './utils/createPackageJsonHandler';
import findPackageJsonPaths from './utils/findPackageJsonPaths';

const run = async (cmd: Command): Promise<boolean[][]> => {
  const config = createConfig({
    fix: cmd.fix,
    showOutdate: cmd.showOutdate,
    packages: [],
  });

  const packageJsonPaths = findPackageJsonPaths();
  const checkPackageJson = createPackageJsonHandler(config);

  return Promise.all(
    packageJsonPaths.map((jsonPath) => checkPackageJson(jsonPath)),
  );
};

export default run;
