#!/bin/bash

# TODO Fix issues in Windows/Git Bash
if [ -n "$MSYSTEM" ]; then
  echo "Skipping tests in Git Bash"
  exit 0;
fi;

# This script is used to generate projects for every supported template and test them.

# Clean up existing test projects
echo "Cleaning up existing test projects..."
rm -rf test-*-project

# Generate and test Angular project
echo "Generating angular project"
node lib/index.js generate-project --name test-angular-project --template angular

echo "Installing dependencies in angular project"
cd test-angular-project
pnpm install

echo "Running tests in angular project"
pnpm run test:ci

cd ..

# Generate and test Next.js project
echo "Generating nextjs project"
node lib/index.js generate-project --name test-nextjs-project --template nextjs

echo "Installing dependencies in nextjs project"
cd test-nextjs-project
pnpm install

echo "Running tests in nextjs project"
pnpm run test:ci

cd ..

# Generate and test Vue.js project
echo "Generating vuejs project"
node lib/index.js generate-project --name test-vuejs-project --template vuejs

echo "Installing dependencies in vuejs project"
cd test-vuejs-project
pnpm install

echo "Running tests in vuejs project"
pnpm run test:ci

cd ..
