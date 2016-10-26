const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

exports.configureEnvironment = ({config, env}) => {
  Object.assign(process.env, {
    _: 'purge',
    CONFIG_PATH: config.path,
    MESSAGES: JSON.stringify(config.messages),
    NODE_ENV: env,
    SETTINGS: JSON.stringify(config.settings),
    STORE: JSON.stringify(config.store)
  }, config.env)
}

exports.makeGetFn = (targets) => {
  return (item) => {
    const ts = targets.filter((t) => t[item] !== undefined)
    if (ts.length > 0) return ts[0][item]
  }
}

function unique (a) {
  return a.reduce(function (n, e) {
    if (n.indexOf(e) === -1) n.push(e)
    return n
  }, [])
}

exports.parseEntries = function (entries, get) {
  const files = unique([...entries, ...(get('entries') || [])])
    .map((entry) => entry.split(':'))
    .filter((entry) => fs.existsSync(entry[0]))
    .map((entry) => entry.length === 1 ? [entry[0], `${get('outdir') || 'assets'}/${entry[0]}`] : entry)
  // TODO: don't make output directories by default
  files.forEach((entry) => mkdirp.sync(path.dirname(entry[1])))
  return files
}

/**
 * A lot of subcommands utilize exact argument lengths. Pop mastarm to handle it.
 */
exports.popMastarmFromArgv = function () {
  process.argv = process.argv.slice(0, 1).concat(process.argv.slice(2))
}
