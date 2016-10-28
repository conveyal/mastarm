const chokidar = require('chokidar')
const fs = require('fs')
const mimeType = require('mime')
const path = require('path')
const postcss = require('postcss')
const postcssNext = require('postcss-cssnext')
const postcssImport = require('postcss-import')
const postcssReporter = require('postcss-reporter')
const postcssSafeParser = require('postcss-safe-parser')

module.exports = function ({
  entry,
  outfile,
  watch
}) {
  let watcher
  const transform = () =>
    postcss([
      postcssImport({
        plugins: [
          base64ify(process.cwd()) // inline all url files
        ],
        onImport: (sources) => {
          if (watch) {
            sources.forEach((source) => watcher.add(source))
          }
        }
      }),
      postcssNext(),
      postcssReporter({clearMessages: true})
    ])
      .process(fs.readFileSync(entry, 'utf8'), {
        parser: postcssSafeParser,
        map: true,
        to: outfile
      })
      .then(function (results) {
        if (outfile) {
          fs.writeFileSync(outfile, results.css)
          if (results.map) {
            fs.writeFile(`${outfile}.map`, results.map, handleErr)
          }
        }
        return results
      })

  if (watch) {
    watcher = chokidar.watch(entry)
    watcher.on('add', transform)
      .on('change', transform)
      .on('unlink', transform)
  }

  return transform()
}

const base64ify = postcss.plugin('postcss-base64ify', function () {
  return function (css, result) {
    const source = css.source.input.file
    const dir = path.dirname(source)
    css.replaceValues(/url\((\s*)(['"]?)(.+?)\2(\s*)\)/g, function (string) {
      const filename = getUrl(string)
        .split('?')[0]
        .split('#')[0]
      let file
      if (filename.indexOf('data') === 0 || filename.length === 0) {
        return string
      } else if (filename[0] === '/') {
        file = path.join(process.cwd(), filename)
      } else {
        file = path.resolve(dir, filename)
      }
      if (!fs.existsSync(file)) {
        throw new Error(`File ${file} does not exist`)
      }
      const buffer = fs.readFileSync(file)
      return 'url("data:' + mimeType.lookup(filename) + ';base64,' + buffer.toString('base64') + '")'
    })
  }
})

function getUrl (value) {
  const reg = /url\((\s*)(['"]?)(.+?)\2(\s*)\)/g
  const match = reg.exec(value)
  const url = match[3]
  return url
}

function handleErr (err) {
  if (err) {
    console.error(err.stack)
  }
}
