# mastarm

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

<p align="center"><img src="mastarm.png" /></p>

<p align="center">Conveyal's front-end JavaScript tool-belt. Build, run, lint and deploy front-end code.</p>

## Table of Contents

* [Install](#install)
* [Configuration](#configuration)
* [CLI Usage](#cli-usage)
  * [Build](#build)
  * [Commit](#commit)
  * [Deploy](#deploy)
  * [Lint](#lint)
  * [Test](#test)

## Install

With [node v6 and npm 3 installed](https://nodejs.org/en/download/current/):

```shell
$ npm install -g mastarm
```

## Configuration

Mastarm can be pointed to a directory containing configuration files using the `--config` flag. By default, Mastarm looks in the `configurations/default` path of the current working directory. Mastarm looks for four different files: `env.yml`, `settings.yml`, `store.yml`, and `messages.yml`.

### `env.yml`

This file should contain strings that can be replaced in front-end JavaScript code using [`envify`](https://github.com/hughsk/envify). [Example in Scenario Editor](https://github.com/conveyal/scenario-editor/blob/master/configurations/default/env.yml.tmp).

### `messages.yml`

This file should contain string messages to be used throughout the application. It will replace `process.env.MESSAGES` with a string-ified version of the object. Just `JSON.parse` it on the client to have access to all of your messages.

### `settings.yml`

Settings contain both Mastarm configuration settings and per environment settings to be used in the application and are usually duplicates of what can be passed from the command line. Current Mastarm settings are:

* `cloudfront` {String} CloudFront distribution id that will automatically invalidate file paths after they are deployed to S3
* `entries` {Array} input:output JavaScript & CSS file pairs
* `env` {String} environment override
* `environments` {Object} override top level settings (see [example](https://github.com/conveyal/modeify/blob/master/configurations/example/settings.yml#L40))
* `flyle` {Boolean} serve map tiles from a local cache for working offline
* `s3bucket` {String} bucket to deploy to
* `serve` {Boolean} serve client side files via budo

### `store.yml`

Auto-populate your redux store with this configuration data instead of setting defaults directly in code.

## CLI Usage

Not all options pertain to all commands.  Entries are in the format `input/file.js:output/file.js`.

```shell
$ mastarm --help

  Usage: mastarm <cmd> [options]


  Commands:

    build [entries...] [options]   Bundle JavaScript & CSS
    commit                         Force intelligent commit messages.
    deploy [entries...] [options]  Bundle & Deploy JavaScript & CSS
    lint [paths...]                Lint JavaScript [& CSS coming soon!]
    test [options]                 Run tests using Jest test runner

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -c, --config <path>            Path to configuration files.
    -e, --env <environment>        Environment to use.
    -m, --minify                   Minify built files.
    -p, --proxy <address>          Proxy calls through to target address.
    -s, --serve                    Serve with budo. Auto-matically rebuilds on changes.
    -u, --update-snapshots         Force update of jest snapshots. USE WITH CAUTION.
    -w, --watch                    Rebuild on changes with watchify.
```

### `build`

Compile JS, HTML, CSS, YAML, Markdown into a single `.js`. Utilizes [babel](https://babeljs.io/), [browserify](https://github.com/substack/node-browserify), [budo](https://github.com/mattdesl/budo), and [postcss](http://postcss.org/).

```shell
$ mastarm build [options] [entries...]

  Options:

    -h, --help             output usage information
    -F, --flyle            Cache and serve tiles.
    -p, --proxy <address>  Proxy calls through to target address.
    -s, --serve            Serve with budo. Auto-matically rebuilds on changes.
    -w, --watch            Automatically rebuild on changes.
```

If no entries are provided, mastarm will use the `entries` option from your `settings.yml` config file. If no entries are found, build will not run.

#### CSS Building

CSS builds occur separately from the browserify build. Any CSS imports into a JavaScript file cause a build error. To build CSS file(s), specify the CSS file(s) as entries in the command. When running in `serve` or `watch` mode, the CSS files get automatically rebuilt, but a manual page refresh is necessary.

### `commit`

Utilize best practices when forming a commit message using [Commitzen](http://commitizen.github.io/cz-cli/) & the [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog) standard.

### `deploy`

Build, push to S3, and invalidate CloudFront in one command.

```shell
$ mastarm deploy --help

Usage: deploy [options] [entries...]

Bundle & Deploy JavaScript & CSS

Options:

  -h, --help    output usage information
  --cloudfront  CloudFront Distribution ID to invalidate.
  --s3bucket    S3 Bucket to push to.

```

### `lint`

Lint using [Standard](http://standardjs.com/). Everything is passed directly to [`standard-engine`](https://github.com/Flet/standard-engine).

```shell
$ mastarm lint [paths...]
```

Optionally pass in a directory (or directories) using the glob pattern. Quote paths containing glob patterns so that they are expanded by standard instead of your shell:

```shell
$ mastarm lint "src/util/**/*.js" "test/**/*.js"
```

Note: by default standard will look for all files matching the patterns: `"**/*.js"`, `"**/*.jsx"`. Always quote the globs. Needed when used as an `npm` command.

### `test`

Run the [Jest](http://facebook.github.io/jest/) test runner on your project. By default, mastarm will run Jest and generate coverage reports on all .js files in the `lib` folder of your project. The `patterns` argument will make Jest run only tests whose filename match the provided pattern.

```shell
$ mastarm test

Usage: test [options] [patterns...]

Run tests using Jest

Options:

  -h, --help                              output usage information
  -u, --update-snapshots                  Force update of snapshots. USE WITH CAUTION.
  --coverage                              Run Jest with coverage reporting
  --no-cache                              Run Jest without cache (defaults to using cache)
  --coverage-paths <paths>                Extra paths to collect code coverage from
  --setup-files <paths>                   Setup files to run before each test
  --test-path-ignore-patterns <patterns>  File patterns to ignore when scanning for test files

```

[npm-image]: https://img.shields.io/npm/v/mastarm.svg?maxAge=2592000&style=flat-square
[npm-url]: https://www.npmjs.com/package/mastarm
[travis-image]: https://img.shields.io/travis/conveyal/mastarm.svg?style=flat-square
[travis-url]: https://travis-ci.org/conveyal/mastarm
