const babelify = require('babelify')
const bcss = require('browserify-css')
const envify = require('envify/custom')
const markdown = require('browserify-markdown')
const commit = require('this-commit')()
const through = require('through2')
const YAML = require('yamljs')

const pkg = require('../lib/pkg')

const babelConfig = require('./babel-config')

module.exports = function transform ({ config, env, instrument }) {
  const envvars = Object.assign(
    {},
    process.env,
    {
      BUILD_TIMESTAMP: (new Date()).getTime(),
      COMMIT_SHA: commit,
      CONFIG_PATH: config.path,
      MESSAGES: JSON.stringify(config.messages),
      NODE_ENV: env,
      REPO_URL: pkg.repository && pkg.repository.url && pkg.repository.url.replace('.git', ''),
      SETTINGS: JSON.stringify(config.settings),
      STORE: JSON.stringify(config.store)
    },
    config.env
  )

  return [
    svgToString,
    imagesToBase64String,
    htmlTransform,
    markdown,
    yamlTransform,
    babelify.configure(babelConfig(env, instrument)),
    [bcss, {global: true}],
    [envify(envvars), { global: true }] // Envify needs to happen last...
  ]
}

/**
 * Transform a svg file to a module containing a JSON string
 */
function svgToString (filename) {
  if (!/\.svg$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(buf.toString('utf8')))
    next()
  })
}

/**
 * Transform an image to a module containing a base64 string.
 */
function imagesToBase64String (filename) {
  if (!/\.png|\.jpg|\.jpeg|\.gif$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(buf.toString('base64')))
    next()
  })
}

/**
 * Transform an html file to a module containing a JSON string
 */
function htmlTransform (filename) {
  if (!/\.html$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(buf.toString('utf8')))
    next()
  })
}

/**
 * Transform an YAML file to a module containing a JSON string
 */
function yamlTransform (filename) {
  if (!/\.yml|\.yaml$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push(
      'module.exports=' + JSON.stringify(YAML.parse(buf.toString('utf8')))
    )
    next()
  })
}
