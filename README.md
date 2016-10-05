# mastarm

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

<p align="center"><img src="mastarm.png" /></p>

<p align="center">Conveyal's front-end JavaScript tool-belt. Build, run, lint and deploy front-end code.</p>

## Install

With [node v6+ and npm 3+ installed](https://nodejs.org/en/download/current/):

```shell
$ npm install -g mastarm
```

## Configuration

Mastarm commands can be pointed to a directory containing configuration files using the `--config` flag. By default, Mastarm will look in the `configurations/default` path of the current working directory. Mastarm currently looks for four different files: `env.yml`, `settings.yml`, `store.yml`, and `messages.yml`.

#### `env.yml`

This file should contain strings that can be replaced in front-end JavaScript code using [`envify`](https://github.com/hughsk/envify). [Example in Scenario Editor](https://github.com/conveyal/scenario-editor/blob/master/configurations/default/env.yml.tmp).

#### `messages.yml`

This file should contain string messages to be used throughout the application. It will replace `process.env.MESSAGES` with a string-ified version of the object. Just `JSON.parse` it to have access to all of your messages.

#### `settings.yml`

Settings contain both Mastarm configuration settings and per environment settings to be used in the application. To override base settings, create an environments section in the `yml` file. [Example in Modeify](https://github.com/conveyal/modeify/blob/master/configurations/example/settings.yml#L40). Each section below will contain the settings that they can use.

## Usage

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
    -S, --skip-check-dependencies  Skip checking and installing out of date package.json dependencies.
    -u, --update-snapshots         Force update of jest snapshots.  USE WITH CAUTION.
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

If no entries are provided, mastarm will attempt to find the entry file. It will first see if the `entry` option has been set in the `settings.yml` config file. If that setting or the file does not exist, it will attempt to build the file specified as `main` in your project's `package.json` file. And finally, if both of those options fail, mastarm will attempt to look for the `index.js` and `index.css` file in the current working directory and attempt to compile each into `assets/index.js` and `assets/index.css` respectively.  

If entries are provided, mastarm will build only those files.

#### CSS Building

Starting with mastarm 1.0.0, CSS builds will occur separately from the browserify build. Thus, any CSS imports into a JavaScript file will cause a build error. Instead, to build CSS file(s), you must specify the file(s) as entries in the command. Also, when running in `serve` or `watch` mode, the CSS files will get automatically rebuilt, but a manual page refresh will be necessary.

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

You can optionally pass in a directory (or directories) using the glob pattern. Be sure to quote paths containing glob patterns so that they are expanded by standard instead of your shell:

```shell
$ mastarm lint "src/util/**/*.js" "test/**/*.js"
```

Note: by default standard will look for all files matching the patterns: `"**/*.js"`, `"**/*.jsx"`. Always quote the globs. Needed when used as an `npm` command.

### `test`

Run the [Jest](http://facebook.github.io/jest/) test runner on your project.  It is expected that you create tests within your project.  By default, mastarm will run Jest and generate coverage reports on all .js files in the `lib` folder of your project.  The `patterns` argument will make Jest run only tests whose filename match the provided pattern.

```shell
$ mastarm test

Usage: test [options] [patterns...]

Run tests using Jest

Options:

  -h, --help                output usage information
  -u, --update-snapshots    Force update of snapshots.  USE WITH CAUTION.
  --coverage                Run Jest with coverage reporting
  --no-cache                Run Jest with cache
  --coverage-paths <paths>  Extra paths to collect code coverage from
  --setup-files <paths>     Setup files to run before each test

```

[npm-image]: https://img.shields.io/npm/v/mastarm.svg?maxAge=2592000&style=flat-square
[npm-url]: https://www.npmjs.com/package/mastarm
[travis-image]: https://img.shields.io/travis/conveyal/mastarm.svg?style=flat-square
[travis-url]: https://travis-ci.org/conveyal/mastarm
