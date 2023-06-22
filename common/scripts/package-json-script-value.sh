#!/bin/bash

if [ -z "$1" ]; then
  echo "Please provide a script name as argument."
  exit 1
fi

find * -type d \( -name 'node_modules' -o -name '.*' \) -prune -o -name 'package.json' -print | while read file; do
  script_value=$(jq -r .scripts."$1" "$file")
  printf "%-70s %s\n" "$file" "$script_value"
done
