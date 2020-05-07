#!/bin/bash
#
# An example hook script to verify what is about to be committed.
# Called by "git commit" with no arguments.  The hook should
# exit with non-zero status after issuing an appropriate message if
# it wants to stop the commit.
#
# To enable this hook, rename this file to "pre-commit".

jsonnet ./drone-jsonnet/drone.jsonnet | json2yaml | diff .drone.yml - &> /dev/null

# TO-DO: check if the .drone.yml is added to the current commit

if [ $? -ne 0 ]; then
  cat <<\EOF
Error: your .drone.yml file does not match the one generated from ./drone_jsonnet/drone.jsonnet.
You might have forgotten to run the generation script or you have accidentally modified the file.
Please run `npm run build-pipeline` and check-in the .drone.yml file into the commit.
EOF
  exit 1
fi
