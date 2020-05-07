// Steps definitions

local group(groupName, step) = step {
  group: groupName,
};

local npmAuth = {
  name:: 'npm-auth',
  image: 'robertstettner/drone-npm-auth',
  secrets: [
    'npm_token',
  ],
};

local compile = {
  name:: 'npm-build',
  image: 'node:10-alpine',
  commands: [
    'npm ci --quiet --no-progress',
    'npm run build',
  ],
};

local unitTests = {
  name:: 'npm-unit-tests',
  image: 'node:10-alpine',
  commands: [
    'npm test',
  ],
};

local npmAudit = {
  name:: 'npm-audit',
  image: 'node:10-alpine',
  commands: [
    'npm audit',
  ],
};

local npmLint = {
  name:: 'npm-lint',
  image: 'node:10-alpine',
  commands: [
    'npm run lint-check',
  ],
};

local npmPublish = {
  name:: 'npm-publish',
  image: 'node:10-alpine',
  commands: [
    'npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN',
    'npm publish',
  ],
  secrets: [
    'npm_token',
  ],
};

// Event triggers

// Push a commit to non-master branch
local whenPushCommit(step) = step {
  when: {
    event: 'push',
  },
};

// Dryrun on push

// Dryrun to dev on commit push
local pushCommitSteps = std.map(
  whenPushCommit,
  [
    npmAuth,
    compile,
    group('sanity-checks', unitTests),
    group('sanity-checks', npmAudit),
    group('sanity-checks', npmLint),
  ]
);

// Publishing
// When a tag starting with v is created in Github/git
local whenPublish(step) = step {
  when: {
    event: 'tag',
    ref: 'refs/tags/*',
  },
};

local publishSteps = std.map(
  whenPublish, [
    npmAuth,
    compile,
    group('sanity-checks', unitTests),
    group('sanity-checks', npmAudit),
    group('sanity-checks', npmLint),
    npmPublish,
  ]
);

// Drone 0.8 expects the 'pipeline' field to be an object of steps, the order is important but jsonnet will sort the keys (i.e. step name). So we are adding index number to all step names to preserve the order. This can be removed when we migrate to Drone 1.0 which takes the steps as an array, which guarantees the order.
// e.g. 'unitTest' => '001_unitTest'
local addIndexToObject(index, obj) = obj { name: std.format('%03d_%s', [index, obj.name]) };
local arrayToObjectWithName(accObj, newObj) = accObj { [newObj.name]: newObj };
local convertStepsToDronePipelineObjectWithIndexedName(steps) =
  std.foldl(arrayToObjectWithName, std.mapWithIndex(addIndexToObject, steps), {});

// All the pipelines
local pipelines = std.flattenArrays([
  pushCommitSteps,
  publishSteps,
]);

// The actual output
{ pipeline: convertStepsToDronePipelineObjectWithIndexedName(pipelines) }
