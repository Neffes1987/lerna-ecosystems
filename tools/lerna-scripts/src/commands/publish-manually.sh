#!/bin/bash

set -e

assume_unchanged () {
  if [ -f "$1" ]; then
    git update-index --assume-unchanged "$1" || echo "can't assume unchanged $1"
  fi
}

revert_assume_unchanged () {
  if [ -f "$1" ]; then
    git update-index --no-assume-unchanged "$1" || echo "can't no assume unchanged $1"
    git update-index --no-skip-worktree "$1" || echo "can't no assume unchanged $1"
  fi
}

post_pack () {
  yarn postpack:packages
  for package in $(node_modules/.bin/lerna list --json | jq -r '. | map(.location) | .[]');
  do
    revert_assume_unchanged "${package}/package.json"
  done
  git reset --hard $GIT_LAST_COMMIT
}

prepare_npmrc () {
   # перенести в.env файл
   NPM_PRIVATE_REGISTRY='' #TODO SET NPM_PRIVATE_REGISTRY
   NPM_PRIVATE_TOKEN='' #TODO SET NPM_PRIVATE_TOKEN
   echo "registry=${NPM_PRIVATE_REGISTRY}" >> "$1"
   echo "${NPM_PRIVATE_REGISTRY}:always-auth=true"  >> "$1"
   echo "${NPM_PRIVATE_REGISTRY}:always-auth=true"  >> "$1"
   echo "${NPM_PRIVATE_REGISTRY}:_authToken=${NPM_PRIVATE_TOKEN}"  >> "$1"
   echo "${NPM_PRIVATE_REGISTRY}:_authToken=${NPM_PRIVATE_TOKEN}"  >> "$1"
}

pre_pack () {
  yarn prepack:packages
  prepare_npmrc ".npmrc"
  for package in $(node_modules/.bin/lerna list --json | jq -r '. | map(.location) | .[]');
  do
      assume_unchanged "${package}/package.json"
  done
}

build_packages () {
   yarn lerna:build:all
}

lerna_publish () {
  RELEASE_TYPE="$1"

  if [ "$RELEASE_TYPE" == "beta" ]
  then
    echo "\e[32m Релиз beta версии"

    pre_pack

    build_packages

    { # try
      node_modules/.bin/lerna publish --ignore-changes '/**/EduApp/**'\
          --conventional-commits \
          --yes \
          --no-private \
          --no-push \
          --exact \
          --message "EDU-1111: chore release beta [manually skip]" \
          --loglevel verbose \
          --force-publish "*"\
          --canary \
          --preid beta

      post_pack

    } || { # catch

      post_pack

      exit 1
    }
  fi

  if [ "$RELEASE_TYPE" == "main" ]
  then
    echo "\e[32m Ручной релиз основной версии"
    { # try
       node_modules/.bin/lerna version --ignore-changes '/**/EduApp/**' \
        --conventional-commits \
        --yes \
        --no-private \
        --exact \
        --no-push \
        --message "EDU-1111: chore release [manually skip]"\
        --loglevel verbose

     GIT_TAGS_LIST=$(git tag --points-at HEAD)

     echo "Список тэгов для публикации: $GIT_TAGS_LIST"

     # меняем пути в package.json каждого пакета на пути из publishConfig
     yarn prepack:packages
     build_packages
     # записываем .npmrc в корень директории
     prepare_npmrc ".npmrc"

     # Публикуем через npm, так как npm все равно на измененные package.json и незакомиченные изменения в отличие от случая, если бы и простановку версий, и публикацию пакетов делали через lerna:publish
     for package in $(node_modules/.bin/lerna list --json | jq -r '. | map(.location) | .[]');
     do
      prepare_npmrc "${package}/.npmrc"
      npm publish "${package}"
     done

     post_pack

    } || { # catch

      post_pack

      exit 1
    }
  fi
}

lerna_publish "$1"
