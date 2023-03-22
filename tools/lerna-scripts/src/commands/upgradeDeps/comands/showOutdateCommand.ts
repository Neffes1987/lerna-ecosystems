import { CommandInterface } from '../interfaces';
import getDependenciesWithNewVersion from '../utils/getDependencyNewVersion';

const showOutdateCommand: CommandInterface = async (
  dependencies,
  { packageJson },
) => {
  const dependenciesWithActualVersion = await getDependenciesWithNewVersion(
    dependencies,
    packageJson,
  );

  dependenciesWithActualVersion.forEach((dependency) => {
    console.info(
      `В пакете ${packageJson.name} устарел пакет ${dependency.name}@${dependency.version}, актуальная версия - ${dependency.latestVersion}`,
    );
  });

  return true;
};

export default showOutdateCommand;
