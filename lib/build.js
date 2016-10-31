const fs = require('fs')
const exorcist = require('exorcist')
const mkdirp = require('mkdirp')
const path = require('path')

const browserify = require('./browserify')
const buildCss = require('./css-transform')

/**
 * Takes a configuration object, array of file entries [entry, output], and other options.
 *
 * @return [Promise] array of Promises
 */

module.exports = function ({
  config,
  env,
  files,
  minify,
  watch
}) {
  return files.map(([entry, outfile]) =>
    path.extname(entry) === '.css'
    ? buildCss({entry, outfile, watch})
    : buildJs({config, entry, env, minify, outfile, watch}))
}

/**
 *
 * @return Promise
 */

function buildJs ({config, entry, env, minify, outfile, watch}) {
  const pipeline = browserify({config, entry, env, minify})
  const bundle = () => {
    return new Promise((resolve, reject) => {
      const stream = pipeline
        .bundle((err, buf) => {
          if (err) reject(err)
          else resolve(buf)
        })

      if (outfile) {
        mkdirp.sync(path.dirname(outfile))
        stream
          .pipe(exorcist(`${outfile}.map`))
          .pipe(fs.createWriteStream(outfile))
      }
    })
  }

  if (watch) {
    pipeline.plugin(require('watchify'), {poll: true})
    pipeline.plugin(require('errorify'))
    pipeline.on('update', bundle)
  }

  return bundle()
}
