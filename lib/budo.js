const path = require('path')

const budo = require('budo')

const transformCss = require('./css-transform')
const logger = require('./logger')
const transformJs = require('./js-transform')

module.exports = function ({ config, env, files, flyle, proxy }) {
  const budoOpts = {
    browserify: {
      debug: true,
      paths: [
        path.join(process.cwd(), '/node_modules'),
        path.join(__dirname, '/../node_modules')
      ],
      transform: transformJs({
        config,
        env,
        minify: false
      })
    },
    cors: true,
    middleware: [],
    pushstate: true
  }
  if (proxy) {
    const middlewareProxy = require('middleware-proxy')
    budoOpts.middleware.push(middlewareProxy('/api', proxy))
  }
  if (flyle) {
    const serveTiles = require('./flyle')
    budoOpts.middleware.push(function (req, res, next) {
      if (req.url.indexOf('/tile') === 0) {
        serveTiles(req, res)
      } else {
        next()
      }
    })
  }

  const budoFiles = []

  files.map(file => {
    if (path.extname(file[0]) === '.css') {
      transformCss({ config, entry: file[0], outfile: file[1], watch: true })
    } else {
      budoFiles.push(file.join(':'))
    }
  })

  budo.cli(budoFiles, budoOpts).on('error', function (err) {
    logger.error(err.stack)
  })
}
