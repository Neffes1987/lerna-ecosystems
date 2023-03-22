import { PackageJson } from '../../utils/types';

export type dependencySectionTypes =
  | 'devDependencies'
  | 'peerDependencies'
  | 'dependencies';

export interface DependencyItemInterface {
  section: dependencySectionTypes;
  name: string;
}

export interface DependencyWithVersionItemInterface
  extends DependencyItemInterface {
  version: string;
  latestVersion: string;
}

export type PackageJsonInfo = {
  packageJson: PackageJson;
  packageJsonPath: string;
};

export type CommandInterface = (
  dependencies: DependencyItemInterface[],
  packageJsonInfo: PackageJsonInfo,
) => Promise<boolean>;

export type FilterDependencyInterface = (
  params: DependencyItemInterface,
  packageJson: PackageJson,
) => boolean;

export interface UpgradeConfigInterface {
  dependencyFilters: FilterDependencyInterface[];
  commands: CommandInterface[];
  sections: dependencySectionTypes[];
}

export interface CreateConfigInterface {
  fix: boolean;
  showOutdate: boolean;
  packages: string[];
}
