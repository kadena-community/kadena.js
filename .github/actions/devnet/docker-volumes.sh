#!/bin/bash

verbose=""
if [[ $1 == "-v" || $1 == "--verbose" ]] ; then
	verbose="-v"
	shift
fi

if [[ $# -ne 3 || ! $2 =~ ^(save|load)$ ]] ; then
	echo "Usage: $0 [-v|--verbose] CONTAINER [save|load] TARBALL" >&2
	exit 1
fi

IMAGE="ubuntu:22.04"

# Set DOCKER=podman if you want to use podman.io instead of docker
DOCKER=${DOCKER:-"docker"}

get_volumes () {
	$DOCKER inspect --type container -f '{{range .Mounts}}{{printf "%v\x00" .Destination}}{{end}}' "$CONTAINER" | head -c -1 | sort -uz
}

save_volumes () {
	if [ -f "$TAR_FILE" ] ; then
		echo "ERROR: $TAR_FILE already exists" >&2
		exit 1
	fi
	umask 077
	# Create a void tar file to avoid mounting its directory as a volume
	touch -- "$TAR_FILE"
	tmp_dir=$(mktemp -du -p /)
	get_volumes | $DOCKER run --rm -i --volumes-from "$CONTAINER" -e LC_ALL=C.UTF-8 -v "$TAR_FILE:/${tmp_dir}/${TAR_FILE##*/}" $IMAGE tar -c -a $verbose --null -T- -f "/${tmp_dir}/${TAR_FILE##*/}"
}

load_volumes () {
	if [ ! -f "$TAR_FILE" ] ; then
		echo "ERROR: $TAR_FILE doesn't exist in the current directory" >&2
		exit 1
	fi
	tmp_dir=$(mktemp -du -p /)
	$DOCKER run --rm --volumes-from "$CONTAINER" -e LC_ALL=C.UTF-8 -v "$TAR_FILE:/${tmp_dir}/${TAR_FILE##*/}":ro $IMAGE tar -xp $verbose -S -f "/${tmp_dir}/${TAR_FILE##*/}" -C / --overwrite
}

CONTAINER="$1"
TAR_FILE=$(readlink -f "$3")

set -e

case "$2" in
	save)
		save_volumes ;;
	load)
		load_volumes ;;
esac