#!/bin/bash

# Set default values
FILENAME='package.json'
KEY=''
DIR_REGEX='.*'
NEW_VALUE=''

# Parse command-line options
while (( "$#" )); do
  case "$1" in
    --file)
      FILENAME=$2
      shift 2
      ;;
    --key)
      KEY=$2
      shift 2
      ;;
    --filter)
      DIR_REGEX=$2
      shift 2
      ;;
    --set)
      NEW_VALUE=$2
      shift 2
      ;;
    --) # end argument parsing
      shift
      break
      ;;
    -*|--*=) # unsupported flags
      echo "Error: Unsupported flag $1" >&2
      exit 1
      ;;
    *) # preserve positional arguments
      PARAMS="$PARAMS $1"
      shift
      ;;
  esac
done
# set positional arguments in their proper place
eval set -- "$PARAMS"

if [ -z "$KEY" ]; then
  echo "Please provide a key with --key option."
  exit 1
fi

IFS=$'\n'
find * -type d \( -name 'node_modules' -o -name '.*' \) -prune -o -name "$FILENAME" -print | grep -E "$DIR_REGEX" | while read -r file; do
  # Set the new value if it was provided
  if [ -n "$NEW_VALUE" ]; then
    jq ".${KEY} = $NEW_VALUE" "$file" > tmp.$$ && mv tmp.$$ "$file"
  fi

  # Print the value
  script_value=$(jq -c ".${KEY}" "$file" 2>/dev/null)
  if [ $? -eq 0 ]; then  # If jq command was successful
    printf "%-70s %s\n" "$file" "$script_value"
  else
    echo "Error processing file $file"
  fi
done
