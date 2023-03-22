import { gt, minVersion } from 'semver';

import { PackageJson } from '../../../utils/types';
import {
  DependencyItemInterface,
  DependencyWithVersionItemInterface,
} from '../interfaces';
import getDependencyVersion from './getDependencyVersion';
import getLatestVersion from './getLatestVersion';

const getDependenciesWithNewVersion = (
  dependencies: DependencyItemInterface[],
  packageJson: PackageJson,
): Promise<DependencyWithVersionItemInterface[]> => {
  return Promise.all(
    dependencies.map(async (dependency) => ({
      ...dependency,
      version: getDependencyVersion(dependency, packageJson),
      latestVersion: await getLatestVersion(dependency.name),
    })),
  ).then((list) =>
    list.filter(({ latestVersion, version }) =>
      gt(latestVersion, minVersion(version) || ''),
    ),
  );
};

export default getDependenciesWithNewVersion;
