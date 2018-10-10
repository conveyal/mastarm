const fs = require('fs')
const path = require('path')

const exorcist = require('exorcist')
const mkdirp = require('mkdirp')

const browserify = require('./browserify')
const logger = require('./logger')

/**
 *
 * @return Promise
 */

module.exports = function buildJs ({
  config,
  entry,
  env,
  minify,
  outfile,
  watch
}) {
  const pipeline = browserify({config, entry, env, minify})
  const bundle = () =>
    new Promise((resolve, reject) => {
      if (outfile) {
        mkdirp.sync(path.dirname(outfile))

        if (minify) {
          pipeline.plugin(require('common-shakeify'))
          pipeline.plugin(require('browser-pack-flat/plugin'))
        }

        let stream = pipeline.bundle()

        if (minify) {
          stream = stream.pipe(require('minify-stream')())
        }

        stream
          .pipe(exorcist(`${outfile}.map`))
          .pipe(fs.createWriteStream(outfile))
          .on('error', reject)
          .on('finish', resolve)
      } else {
        pipeline.bundle((err, buf) => {
          if (err) reject(err)
          else resolve(buf)
        })
      }
    })

  if (watch) {
    pipeline.plugin(require('watchify'), { poll: true })
    pipeline.plugin(require('errorify'))
    pipeline.on('update', bundle)
    pipeline.on('log', logger.log)
  }

  return bundle()
}
