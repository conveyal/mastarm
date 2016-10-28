const browserify = require('browserify')
const path = require('path')
const uglifyify = require('uglifyify')

const transform = require('./js-transform')

module.exports = function ({
  config,
  entry,
  env,
  minify
}) {
  const pipeline = browserify(entry, {
    basedir: process.cwd(),
    cache: {},
    debug: true,
    packageCache: {},
    paths: [
      path.join(__dirname, '/../node_modules'),
      path.join(process.cwd(), '/node_modules')
    ],
    transform: transform({
      config,
      env
    })
  })
  .on('error', function (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(0)
  })
  .on('log', function (message) {
    console.log(message)
  })

  if (minify) {
    pipeline.transform(uglifyify, {global: true})
  }

  return pipeline
}
