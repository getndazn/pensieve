#!/bin/bash

function error() {
  echo "ERROR: $1"
  exit 1
}

function commit-msg() {
  local file=$1

  head -n 1 $file | grep -Eq '^(fix|feat|docs|build|chore): ' ||
    error "Please specify a valid commit type (fix, feat, docs, build, or chore) at the beginning the commit message. See the CONTRIBUITING.md file for more information."
}

githook=$1
params=$HUSKY_GIT_PARAMS

$githook $params
