const concat = require('concat-stream')
const fs = require('fs')
const http = require('http')
const https = require('https')
const mkdirp = require('mkdirp')
const path = require('path')
const parse = require('url').parse

const HTTP_SUCCESS_OK = 200
const DEFAULT_CACHE_DIRECTORY = `${process.env.HOME}/.flyle`
const DEFAULT_PNG = path.resolve(__dirname, '../mastarm.png')

module.exports = function (req, res) {
  const url = parse(req.url, true).query.url
  const isHttps = url.indexOf('https') !== -1
  const get = isHttps ? https.get : http.get
  const filePath = isHttps ? url.split('https://')[1] : url.split('http://')[1]
  const fullPath = path.resolve(DEFAULT_CACHE_DIRECTORY, filePath)
  fs.stat(fullPath, (err, stats) => {
    if (!err && stats.isFile()) {
      sendImg({path: fullPath, res})
    } else {
      get(url, (fileResponse) => {
        mkdirp(path.dirname(fullPath), (err) => {
          if (err) {
            logAndSend({err, res})
          } else {
            fileResponse.pipe(concat((png) => {
              fs.writeFile(fullPath, png, (err) => {
                if (err) {
                  logAndSend({err, res})
                } else {
                  sendImg({path: fullPath, res})
                }
              })
            }))
          }
        })
      }).on('error', (err) => {
        logAndSend({err, res})
      })
    }
  })
}

function logAndSend ({err, res}) {
  console.error('flyle >> sending default image: ', err.message)
  sendImg({
    path: DEFAULT_PNG,
    res
  })
}

function sendImg ({path, res}) {
  res.writeHead(HTTP_SUCCESS_OK, {
    'Content-Type': 'image/png'
  })
  fs.createReadStream(path).pipe(res)
}
