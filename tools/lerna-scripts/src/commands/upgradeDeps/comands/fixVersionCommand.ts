import fs from 'fs-extra';

import { PackageJson } from '../../../utils/types';
import { CommandInterface } from '../interfaces';
import getDependenciesWithNewVersion from '../utils/getDependencyNewVersion';

const fixVersionCommand: CommandInterface = async (
  dependencies,
  { packageJson, packageJsonPath },
) => {
  if (!dependencies.length) {
    return false;
  }
  const dependenciesWithActualVersion = await getDependenciesWithNewVersion(
    dependencies,
    packageJson,
  );
  const newPackageJson: PackageJson = JSON.parse(JSON.stringify(packageJson));

  dependenciesWithActualVersion.forEach(
    ({ name, section, latestVersion, version }) => {
      // @ts-ignore
      newPackageJson[section][name] =
        version[0] === '^' ? `^${latestVersion}` : latestVersion;
    },
  );

  const updatedPackageJsonContent = `${JSON.stringify(
    newPackageJson,
    null,
    '  ',
  )}\n`;
  fs.writeFileSync(packageJsonPath, updatedPackageJsonContent);

  return true;
};

export default fixVersionCommand;
