#!/bin/bash

# Save the volume to a file
docker run --rm -v "sandbox:/data" -v "$(pwd):/backup" busybox tar -czvf /backup/sandbox_volume.tar.gz /data