git checkout master
git merge dev

#!/usr/bin/env sh
set -e
echo "Enter release version: "
read VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  # build
  npm run build:lib
  if [[ `git status --porcelain` ]]; 
  then
    git add -A
    git commit -am "[build] $VERSION"
  fi

  # commit
  npm version $VERSION --message "[release] $VERSION aa"

  # publish
  git push origin master
  git tag v$VERSION -m "[release] $VERSION"
  git push origin v$VERSION
  npm publish

  # sync dev
  # git checkout dev
  # git rebase master
  # git push origin dev
fi
