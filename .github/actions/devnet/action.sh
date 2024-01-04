#!/bin/bash
if [ -n "$INPUT_USERNAME" ];
	then echo "$INPUT_PASSWORD" | docker login "$INPUT_REGISTRY" -u "$INPUT_USERNAME" --password-stdin
fi

if [ -n "$INPUT_DOCKER_NETWORK" ];
	then INPUT_OPTIONS="$INPUT_OPTIONS --network $INPUT_DOCKER_NETWORK"
fi

echo "docker run -v \"/var/run/docker.sock\":\"/var/run/docker.sock\" \
	-v /home/runner/work/_temp:/home/runner/work/_temp \
	-e GITHUB_ENV -e GITHUB_OUTPUT -e GITHUB_PATH -e GITHUB_STATE -e GITHUB_STEP_SUMMARY \
	$INPUT_OPTIONS \"$INPUT_IMAGE\" -c \"${INPUT_RUN//$'\n'/;}\""

exec docker run \
  --name=devnet -d --health-cmd='curl --verbose --fail http://localhost:8080/info || exit 1'
  -v "/var/run/docker.sock":"/var/run/docker.sock" \
  -v /home/runner/work/_temp:/home/runner/work/_temp \
  -e GITHUB_ENV -e GITHUB_OUTPUT -e GITHUB_PATH -e GITHUB_STATE -e GITHUB_STEP_SUMMARY 	\
  -p 8080:8080 "kadena/devnet"
