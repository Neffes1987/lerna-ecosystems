import { getPackage } from '../../../utils/getPackage';
import {
  CommandInterface,
  DependencyItemInterface,
  FilterDependencyInterface,
  UpgradeConfigInterface,
  dependencySectionTypes,
} from '../interfaces';
import getDependencyItems from './getDependencyItems';

const createPackageJsonHandler = ({
  dependencyFilters,
  commands,
  sections,
}: UpgradeConfigInterface) => async (
  packageJsonPath: string,
): Promise<boolean[]> => {
  try {
    const packageJson = getPackage(packageJsonPath);

    // @ts-ignore eslint-disable-next-line
    delete packageJson.normalizedName;

    const dependencies: DependencyItemInterface[] = sections
      .map((dependencySection: dependencySectionTypes) =>
        getDependencyItems(dependencySection, packageJson),
      )
      .reduce((a: DependencyItemInterface[], b: DependencyItemInterface[]) => [
        ...a,
        ...b,
      ]);

    const filteredDependencies: DependencyItemInterface[] = dependencies.filter(
      (dependency) =>
        dependencyFilters.every((filter: FilterDependencyInterface) =>
          filter(dependency, packageJson),
        ),
    );

    return Promise.all(
      commands.map((command: CommandInterface) =>
        command(filteredDependencies, {
          packageJson,
          packageJsonPath,
        }),
      ),
    );
  } catch (e) {
    console.log(e.message);
  }

  return Promise.resolve([]);
};

export default createPackageJsonHandler;
