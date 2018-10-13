const addExports = require('babel-plugin-add-module-exports')
const babelEnv = require('@babel/preset-env')
const flow = require('@babel/preset-flow')
const react = require('@babel/preset-react')
const reactRequire = require('babel-plugin-react-require').default
const lodash = require('babel-plugin-lodash')
const reactDisplayName = require('@babel/plugin-transform-react-display-name')
const classProperties = require('@babel/plugin-proposal-class-properties')
const exportFrom = require('@babel/plugin-proposal-export-namespace-from')

const browsers = require('./constants').BROWSER_SUPPORT

module.exports = function (env) {
  const plugins = [
    addExports,
    classProperties,
    exportFrom,
    lodash,
    reactDisplayName,
    reactRequire
  ]

  return {
    plugins,
    presets: [
      [
        babelEnv,
        {
          loose: false, // Loose mode breaks spread operator on `Set`s
          targets: { browsers },
          useBuiltIns: 'usage'
        }
      ],
      flow,
      react
    ]
  }
}
