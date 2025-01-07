#!/bin/bash

# Define the archive name with a timestamp in a safe format
ARCHIVE_NAME="front_end_build_$(date +%Y%m%d%H%M%S).zip"

# Create the archive excluding .git, node_modules, log files, build.sh, .gitignore, and tests
zip -r "$ARCHIVE_NAME" . \
  -x ".git/*" \
  -x "node_modules/*" \
  -x "*.log" \
  -x "build.sh" \
  -x ".gitignore" \
  -x "tests/*"

echo "Build archive created: $ARCHIVE_NAME"