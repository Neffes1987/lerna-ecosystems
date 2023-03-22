const fs = require('fs');
const path = require('path');

const execa = require('execa');

const COMMAND_TO_GET_BRANCH_NAME = 'git symbolic-ref --short HEAD';

const RELEASING_MANUALLY_PREFIX = '[manually skip]';

const RELEASING_CI_PREFIX = '[ci skip]';

// http://stackoverflow.com/a/2498553/3094399
const isInABranch = (branchName) => branchName !== '(no branch)';

const getCommitMsgFileFromHuskyParams = () => {
  return 'HUSKY_GIT_PARAMS' && process.env.HUSKY_GIT_PARAMS ? process.env.HUSKY_GIT_PARAMS.split(' ')[0] : null;
};

const getCommitMsgFile = () => {
  const commitMsgFile = process.argv[2] || getCommitMsgFileFromHuskyParams() || './.git/COMMIT_EDITMSG';
  return path.resolve(`${process.cwd()}`, commitMsgFile);
};

const readContentOfOriginalCommitMsg = () => fs.readFileSync(getCommitMsgFile(), 'utf-8');

const isCICommit = () => {
  const msg = readContentOfOriginalCommitMsg().toString();
  return msg.endsWith(RELEASING_CI_PREFIX);
};

const isUtilityCommit = () => {
  const msg = readContentOfOriginalCommitMsg().toString();
  return msg.endsWith(RELEASING_MANUALLY_PREFIX);
};

const writeContentToCommitMsgFile = (newContents) =>
  // Пишем обратно в .git/COMMIT_EDITMSG
  fs.writeFileSync(getCommitMsgFile(), newContents);

const getCurrentBranchName = async () => {
  const { stdout } = await execa(COMMAND_TO_GET_BRANCH_NAME, { shell: true });
  return stdout;
};

const addPrefixToCommitMsg = (prefix) => {
  const originMsg = fs.readFileSync(getCommitMsgFile(), 'utf-8');
  if (originMsg.trim().endsWith(prefix)) {
    return process.exit(0);
  }
  return writeContentToCommitMsgFile(`${originMsg.trim()} [${prefix}]`);
};

async function main() {
  if (!isInABranch() || isCICommit() || isUtilityCommit()) {
    return process.exit(0);
  }

  return Promise.resolve()
    .then(getCurrentBranchName)
    .then(addPrefixToCommitMsg)
    .catch((err) => {
      console.error(
        'Возникла ошибка при попытке добавить префикс ветки к коммиту, коммит создан без префикса в сообщении',
      );
      console.error(err);
      process.exit(0);
    });
}

main();
