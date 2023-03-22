#!/bin/bash

set -e
set -x

assume_unchanged () {
  git update-index --assume-unchanged "$1" || echo "can't assume unchanged $1"
}

prepare_npmrc () {
   echo "registry=${NPM_PRIVATE_REGISTRY}" >> "$1"
   echo "//${NPM_PRIVATE_REGISTRY}/npm-group/:always-auth=true"  >> "$1"
   echo "//${NPM_PRIVATE_REGISTRY}/repository/npm-public/:always-auth=true"  >> "$1"
   echo "//${NPM_PRIVATE_REGISTRY}/repository/npm-public/:_authToken=${NPM_PRIVATE_TOKEN}"  >> "$1"
   echo "//${NPM_PRIVATE_REGISTRY}/repository/npm-group/:_authToken=${NPM_PRIVATE_TOKEN}"  >> "$1"
}

post_pack () {
  yarn postpack:packages
}

pre_pack () {
  yarn prepack:packages
}

build_packages () {
   yarn lerna:build:ci
}

lerna_publish () {
    echo "NPM_PRIVATE_REGISTRY: ${NPM_PRIVATE_REGISTRY}"
    echo "NPM_PRIVATE_TOKEN: ${NPM_PRIVATE_TOKEN}"
    echo -e "\e[32m  Установка git credentials..."

    GIT_COMMIT=$(git rev-parse --verify HEAD)
    GIT_NAME=$(git --no-pager show -s --format='%an' "$GIT_COMMIT")
    GIT_EMAIL=$(git --no-pager show -s --format='%ae' "$GIT_COMMIT")
    GIT_PATCH_PREFIX=$(date +%F-%T | tr ":" "-") # было +%F-%k-%M-%S '2020-11-20- 9-45-46' появлялся пробел

    git config user.email "$GIT_EMAIL"
    git config user.name "$GIT_NAME"
    git config push.default simple

    git fetch origin

    # гарантируем, что master актуальный
    git checkout -b patch_${GIT_PATCH_PREFIX}
    git branch -D master || true
    git checkout -b master origin/master
    git branch -D patch_${GIT_PATCH_PREFIX}

    git status
    git diff

    { # try
       # проставляем версии и делаем комит
        node_modules/.bin/lerna version \
        --conventional-commits \
        --yes \
        --no-push \
        --message "chore: release [ci skip]"\
        --loglevel verbose

       GIT_LERNA_COMMIT=$(git rev-parse --verify HEAD)
       # находим список тэгов, которые проставила lerna к этому моменту - это изменившиеся пакеты
       GIT_TAGS_LIST=$(git tag --points-at "$GIT_LERNA_COMMIT")

       if [[ -z $GIT_TAGS_LIST ]]; then
           echo "\e[32m  Список тэгов пуст: нет пакетов для публикации в nexus"
           exit 0
       fi

       # находим список всех пакетов в области видимости lerna
       LERNA_PACKAGES=$(node_modules/.bin/lerna list --json)

       # меняем пути в package.json каждого пакета на пути из publishConfig
       pre_pack

       # собираем все пакеты
       build_packages

       # находим список пакетов, которые изменились и нужно опубликовать новую версию
       AFFECTED_PACKAGES=$(node ./tools/get-affected-packages --tags "$GIT_TAGS_LIST" --packages "$LERNA_PACKAGES")

       echo -e "\e[32m  Публикация в npm..."

       for dir in $AFFECTED_PACKAGES;
        do
         prepare_npmrc "${dir}/.npmrc"
         assume_unchanged "${dir}/.npmrc"
         npm publish "${dir}"
        done

       post_pack

    } || { # catch
       post_pack
       exit 1
    }

  git push origin master  --follow-tags
}


lerna_publish
