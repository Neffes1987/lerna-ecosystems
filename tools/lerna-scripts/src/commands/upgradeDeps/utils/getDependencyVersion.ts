import { PackageJson } from '../../../utils/types';
import { DependencyItemInterface } from '../interfaces';

const getDependencyVersion = (
  dependency: DependencyItemInterface,
  packageJson: PackageJson,
): string => {
  // @ts-ignore
  return packageJson[dependency.section][dependency.name];
};

export default getDependencyVersion;
