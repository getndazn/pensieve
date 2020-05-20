# Contributing to Pensieve

> Please note that this project is released with a [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).
> By participating in this project you agree to abide by its terms.

Thanks for taking the time to contribute to this project! ❤️

## Table of contents
* [Local development](#local-development)
  + [Installation](#installation)
  + [Testing](#testing)
  + [Publishing](#publishing)
* [Report a bug or a new feature request](#report-a-bug-or-a-new-feature-request)
* [Contributing to the codebase](#contributing-to-the-codebase)
* [Writing and improving the documentation](#writing-and-improving-the-documentation)
* [Commit messages](#commit-messages)

## Local development

### Installation

To get the project up and running locally, run this in your terminal:

```bash
$ git clone git@github.com:getndazn/pensieve.git && cd pensieve
$ npm ci
```

### Testing
 
To run the unit tests:

```bash
$ npm t
```

### Publishing

1. Run these commands in your terminal:

```bash
$ # Create a new version
$ npm version 0.1.0 -m "build: new npm version"
$ git push origin master
```

2. Go to: https://github.com/getndazn/pensieve/releases & create a new release using the same version above.

## Report a bug or a new feature request

* Before reporting a bug or a new feature request, please make sure that a relevant [issue hasn't been reported already](https://github.com/getndazn/pensieve/issues).

* If the issue is not existing, [open a new issue](https://github.com/getndazn/pensieve/issues/new). Please make sure you fill the issue description with all the information suggested in the issue template.

## Contributing to the codebase

* Implement your commits in a separated branch, branching off from master.

* Push your branch to the origin.

* Go to the [Pull Request section](https://github.com/getndazn/pensieve/pulls) and create a new Pull Request based on your branch. Please make sure you fill the description with all the information suggested in the template.

## Writing and improving the documentation

We strive to make our library's documentation as clear and helpful as possible for everyone. If you would like improve our documentation, please create a Pull Request by following [these instructions](#contributing-to-the-codebase).

## Commit messages

Make sure your commit messages are compliant with the following convention:

* Committing a bug fix:

```text
fix: some informative description
```

* Committing a new feature:

```text
feat: some informative description
```

* Committing a breaking change:

```text
feat: some informative description

BREAKING CHANGE: some informative description about the breaking change
```

* Committing a documentation update:

```text
docs: some informative description
```

* Committing a change to the build/publish pipeline:

```text
build: some informative description
```

* Committing a documentation update:

```text
chore: some informative description
```

TIP: [commitizen](https://github.com/commitizen/cz-cli) can help you following this convention.  
Run this command to install it in your local environment:

```
npm install -g commitizen
```
