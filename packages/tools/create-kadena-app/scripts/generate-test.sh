#!/bin/bash

# TODO Fix issues in Windows/Git Bash
if [ -n "$MSYSTEM" ]; then
  echo "Skipping tests in Git Bash"
  exit 0;
fi;

# This script is used to generate projects for every supported template and test them.

# echo "Generating angular project"
node lib/index.js generate-project --name test-angular-project --template angular

# echo "Running tests in angular project"
cd test-angular-project
npm run test:ci

cd ..

# echo "Generating nextjs project"
node lib/index.js generate-project --name test-nextjs-project --template nextjs

# echo "Running tests in nextjs project"
cd test-nextjs-project
npm run test:ci

cd ..

# echo "Generating vuejs project"
node lib/index.js generate-project --name test-vuejs-project --template vuejs

# echo "Running tests in vuejs project"
cd test-vuejs-project
npm run test:ci
