import fixVersionCommand from '../comands/fixVersionCommand';
import showOutdateCommand from '../comands/showOutdateCommand';
import { CreateConfigInterface, UpgradeConfigInterface } from '../interfaces';

const createConfig = ({
  fix,
  showOutdate,
  packages,
}: CreateConfigInterface): UpgradeConfigInterface => {
  const config: UpgradeConfigInterface = {
    dependencyFilters: [],
    commands: [],
    sections: ['devDependencies', 'dependencies'],
  };

  config.dependencyFilters.push(({ name }) => packages.includes(name));

  if (showOutdate) {
    config.commands.push(showOutdateCommand);
  }

  if (fix) {
    config.commands.push(fixVersionCommand);
  }

  return config;
};

export default createConfig;
