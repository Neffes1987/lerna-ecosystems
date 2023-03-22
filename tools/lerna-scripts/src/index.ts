import chalk from 'chalk';
import program, { Command } from 'commander';
import execa from 'execa';

function actionWrapper(actionRequireFunc: any, exportName: string): (...args: string[]) => Promise<never> {
  return async (...args: string[]) => {
    try {
      const module = await actionRequireFunc();
      const func = module[exportName];
      await func(...args);
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
}

async function exec(cmd: string) {
  await execa(cmd, { stdio: 'inherit', shell: true });
}

const main = (argv: string[]) => {
  program.name('@COMPONENTS:TOOLS-CLI');

  program
    .command('publish:manually')
    .description('Простановка версии пакета, ручная публикация пакета в npm')
    .option('-b, --beta', 'Релиз beta версии пакета')
    .option('-m, --main', 'Ручной релиз основной версии пакета')
    .action(async (cmd: Command) => {
      let flag = '';
      flag = cmd.b || cmd.beta ? 'beta' : flag;
      flag = cmd.main ? 'main' : flag;
      await exec(`tools/lerna-scripts/src/commands/publish-manually.sh ${flag}`);
    });

  program
    .command('pack')
    .description('Меняет в package.json пакета пути main,types на build/*, создает backup package.json для отката')
    .action(actionWrapper(() => import('./commands/pack'), 'prePack'));

  program
    .command('revertPack')
    .description(
      'Возвращает пакет в исходное состояние, которое было до публикации (накатывает созданный backup в package.json)',
    )
    .action(actionWrapper(() => import('./commands/pack'), 'revertPack'));

  program
    .command('checkDependencies')
    .description('Проверяет, что все нужные зависимости указаны в package.json пакета, нет phantom dependencies ')
    .option('--fix', 'Автоматическая простановка недостающих зависимостей в package.json пакета')
    .action(actionWrapper(() => import('./commands/checkDep'), 'default'));

  program
    .command('test')
    .description('Запускает unit тесты для пакета')
    .option('--coverage', 'Генерирует отчет по покрытию тестами')
    .action(actionWrapper(() => import('./commands/test'), 'default'));

  program
    .command('syncPackages')
    .description('Обновляет конфиги сразу по всей группе пакетов')
    .option('-p, --path', 'Путь для группы пакетов')
    .action(actionWrapper(() => import('./commands/syncPackages'), 'default'));

  program
    .command('generate:package')
    .arguments('<componentName>')
    .description('Создать новый пакет с готовым шаблоном в директории modules/')
    .action(actionWrapper(() => import('./commands/generatePackage'), 'default'));

  program
    .command('clean')
    .description('Удалить директории build всех пакетов')
    .action(actionWrapper(() => import('./commands/clean'), 'default'));

  program
    .command('upgradeDeps')
    .description('Проверяет и обновляет устаревшие зависимости')
    .option('--fix', 'Обновить все устаревшие')
    .option('--showOutdate', 'Распечатать все устаревшие')
    .action(actionWrapper(() => import('./commands/upgradeDeps/index'), 'default'));

  program.on('command:*', () => {
    console.log();
    console.log(chalk.red(`Невалидная команда: ${chalk.cyan(program.args.join(' '))}`));
    console.log(chalk.red('Введи команду --help для списка доступных команд'));
    console.log();
    process.exit(1);
  });

  if (process.argv && !process.argv.slice(2).length) {
    program.outputHelp(chalk.yellow);
  }

  program.parse(argv);
};

process.on('unhandledRejection', (rejection) => {
  console.log(rejection);
});

main(process.argv);
