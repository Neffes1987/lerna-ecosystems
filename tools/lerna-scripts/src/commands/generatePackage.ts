import { resolve as resolvePath } from 'path';

import { Command } from 'commander';
import fs from 'fs-extra';
import walk from 'klaw-sync';
// @ts-ignore
import chalk from 'react-dev-utils/chalk';
import rif from 'replace-in-file';

export default async (cmd: Command): Promise<void> => {
  const component = cmd;
  const Component = component[0] + component.slice(1);
  const ComponentName = Component.split('/').slice(-1);
  // директория, в которой будет создан пакет
  const packageDefaultDirPath = `src/modules/${Component}`;
  const templateDir = resolvePath('tools/templates/template-component');

  const replace = (path: string): void => {
    const name = path.includes('package.json') ? [String(ComponentName).toLowerCase()] : ComponentName;
    const options = {
      files: path,
      from: [/component_name/g, /COMPONENT_NAME/g],
      to: [name, component],
    };

    try {
      rif.sync(options);
    } catch (error) {
      console.error('Error occurred:', error);
      process.exit(1);
    }
  };

  fs.copySync(templateDir, packageDefaultDirPath);

  const paths = walk(packageDefaultDirPath);
  paths.forEach((it) => {
    replace(it.path);
    console.log(chalk.green(`Generating file: ${it.path}`));
  });

  // переименование файл компонента
  try {
    fs.renameSync(
      resolvePath(`${packageDefaultDirPath}/src/COMPONENT_NAME.tsx`),
      resolvePath(`${packageDefaultDirPath}/src/${ComponentName}.tsx`),
    );
  } catch (error) {
    console.error('File rename failed:', error);
    process.exit(1);
  }

  console.log();
  console.log(chalk.green(`Пакет успешно создан в ${packageDefaultDirPath}`));
};
