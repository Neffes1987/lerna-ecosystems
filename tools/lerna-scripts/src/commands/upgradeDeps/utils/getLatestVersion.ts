import execa from 'execa';

import cachingDecorator from './cachingDecorator';

const getLatestVersion = async (packageName: string): Promise<string> => {
  const { stdout } = await execa('yarn', ['info', packageName, '--json']);

  return JSON.parse(stdout).data['dist-tags'].latest;
};

export default cachingDecorator(getLatestVersion);
