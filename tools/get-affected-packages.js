const argv = require('minimist')(process.argv.slice(2), { string: '_' });

function parseTag(tag) {
  const data = tag.split('@');
  return {
    name: data.slice(0, data.length - 1).join('@'),
    version: data[data.length - 1],
  };
}

async function main() {
  const pkgs = JSON.parse(argv.packages);
  const tags = argv.tags.split('\n');

  const affectedPackages = tags
    .map((tag) => {
      const { name } = parseTag(tag);
      const findedPackage = pkgs.find((pck) => pck.name === name);
      return findedPackage && findedPackage.location;
    })
    .filter(Boolean);

  console.log(affectedPackages.join(' '));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
