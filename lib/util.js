const fs = require('fs')
const unique = require('lodash.uniq')

exports.configureEnvironment = ({config, env}) => {
  Object.assign(process.env, {
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

exports.parseEntries = function (entries, get) {
  return unique([...entries, ...(get('entries') || [])])
    .map((entry) => entry.split(':'))
    .map((entry) => entry.length === 1 ? [entry[0], `${get('outdir') || 'assets'}/${entry[0]}`] : entry)
}

exports.assertEntriesExist = function (entries) {
  if (entries.length === 0) {
    throw new Error('No file(s) found! Did you spell the filename(s) correctly?')
  }
  entries.forEach((entry) => {
    if (!fs.existsSync(entry[0])) throw new Error(`Entry: ${entry[0]} does not exist`)
  })
}

/**
 * A lot of subcommands utilize exact argument lengths. Pop mastarm to handle it.
 */
exports.popMastarmFromArgv = function () {
  process.argv = process.argv.slice(0, 1).concat(process.argv.slice(2))
}
