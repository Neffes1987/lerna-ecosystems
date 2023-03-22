import { PackageJson } from '../../../utils/types';
import { DependencyItemInterface, dependencySectionTypes } from '../interfaces';

const getDependencyItems = (
  dependencySection: dependencySectionTypes,
  packageJson: PackageJson,
): DependencyItemInterface[] => {
  const dependenciesNames: string[] = Object.keys(
    packageJson[dependencySection] || {},
  ) as string[];

  return dependenciesNames.map((dependencyName: string) => ({
    section: dependencySection,
    name: dependencyName,
  }));
};

export default getDependencyItems;
