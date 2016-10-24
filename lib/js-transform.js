const babelify = require('babelify')
const envify = require('envify/custom')
const markdown = require('browserify-markdown')
const through = require('through2')
const YAML = require('yamljs')

const babelConfig = require('./babel-config')
const util = require('./util')

module.exports = function transform ({
  config,
  env
}) {
  util.configureEnvironment({config, env})

  return [
    htmlTransform,
    markdown({
      html: true
    }),
    yamlTransform,
    babelify.configure(babelConfig(env)),
    envify(process.env) // Envify needs to happen last...
  ]
}

function htmlTransform (filename) {
  if (!/\.html$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(buf.toString('utf8')))
    next()
  })
}

function yamlTransform (filename) {
  if (!/\.yml|\.yaml$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(YAML.parse(buf.toString('utf8'))))
    next()
  })
}
