const babel = require('babel-core')
const fs = require('fs')
const glob = require('glob')
const mkdirp = require('mkdirp')
const path = require('path')

const babelConfig = require('./babel-config')

module.exports = function ({
  entries,
  env,
  outdir
}) {
  return entries.reduce((results, entry) =>
    fs.statSync(entry[0]).isDirectory()
      ? [...results, ...transformDir({config: babelConfig(env), entry, outdir})]
      : [...results, transformFile({config: babelConfig(env), entry, outdir})], [])
}

function transformDir ({
  config,
  entry,
  outdir
}) {
  return glob
    .sync(`${entry[0]}/**/*.js`)
    .map((filename) =>
      transformFile({
        config,
        entry: [filename, filename.replace(entry[0], entry[1] || outdir)]
      }))
}

function transformFile ({
  config,
  entry,
  outdir
}) {
  const filename = entry[0]
  const filepath = entry[1] || `${outdir}/${filename}`
  const results = babel.transform(fs.readFileSync(filename, 'utf8'), Object.assign({}, config, {filename, sourceMaps: true}))
  mkdirp.sync(path.dirname(filepath))
  fs.writeFileSync(filepath, results.code + '\n\n//# sourceMappingURL=' + path.basename(filepath))
  fs.writeFileSync(`${filepath}.map`, JSON.stringify(results.map))

  return results
}
