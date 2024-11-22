#!/bin/bash

# Get the list of all worktrees
worktrees=$(git worktree list | awk '{print $1}')

# Extract the first worktree
first_worktree=$(echo "$worktrees" | head -n 1)

# Create symlinks for all other worktrees
echo "$worktrees" | tail -n +2 | while read -r worktree; do
    target_dir="$worktree/.turbo/cache"
    source_dir="$first_worktree/.turbo/cache"

    # Check if the target directory exists
    if [ -d "$target_dir" ] || [ -L "$target_dir" ]; then
        echo "Removing existing directory or symlink: $target_dir"
        rm -rf "$target_dir"
    fi

    # Create the symlink
    ln -s "$source_dir" "$target_dir"
    echo "Symlink created: $target_dir -> $source_dir"
done
