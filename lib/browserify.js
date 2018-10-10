const browserify = require('browserify')
const path = require('path')

const transform = require('./js-transform')

/**
 * Bundle some js together with browserify
 */
module.exports = function ({config, entry, env, minify}) {
  return browserify(entry, {
    basedir: process.cwd(),
    cache: {},
    debug: true,
    fullPaths: env === 'development',
    packageCache: {},
    paths: [
      path.join(__dirname, '/../node_modules'),
      path.join(process.cwd(), '/node_modules')
    ],
    transform: transform({ config, env, minify })
  })
}
