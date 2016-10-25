const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const pkg = require('./pkg')

exports.makeGetFn = (targets) => {
  return (item) => {
    const ts = targets.filter((t) => t[item] !== undefined)
    if (ts.length > 0) return ts[0][item]
  }
}

exports.parseEntries = function (entries, get) {
  const files = []

  /*
   * safePushToFile
   *
   * Pushes to files if entry file exists
   *
   * @param entry {String} file in the pattern "inpath[:outpath]"
   */
  const safePushToFile = (entry) => {
    entry = entry.split(':')
    if (fs.existsSync(entry[0])) {
      if (entry.length === 1) {
        entry.push(`assets/${entry[0]}`)
      }
      files.push(entry)
      mkdirp.sync(path.dirname(entry[1]))
    }
  }

  // parse user-provided entries
  entries.forEach(safePushToFile)

  // if no valid user-provided files, attempt to find logical entry point
  if (files.length === 0) {
    const entry = get('entry') || pkg.main || 'index.js'
    const outfile = get('outfile') || 'assets/index.js'
    safePushToFile(`${entry}:${outfile}`)
    if (entry === 'index.js') {
      safePushToFile('index.css:assets/index.css')
    }
  }

  return files
}

/**
 * A lot of subcommands utilize exact argument lengths. Pop mastarm to handle it.
 */
exports.popMastarmFromArgv = function () {
  process.argv = process.argv.slice(0, 1).concat(process.argv.slice(2))
}
