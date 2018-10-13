const path = require('path')

const pkg = require('./pkg')

module.exports.generateTestConfig = (patterns, options) => {
  // jest config params
  const jestConfig = {
    collectCoverage: options.coverage,
    collectCoverageFrom: ['lib/**/*.js'],
    coverageDirectory: 'coverage',
    moduleFileExtensions: [
      'js',
      'jsx',
      'json',
      'yml'
    ],
    notify: true,
    testPathIgnorePatterns: [
      '<rootDir>/node_modules/',
      '<rootDir>/__tests__/test-utils'
    ],
    testURL: 'http://localhost:9966',
    transform: {
      '\\.yml$': 'jest-yaml-transform',
      '^.+\\.jsx?$': path.resolve(__dirname, 'jest-preprocessor.js')
    }
  }

  if (options.coveragePaths) {
    jestConfig.collectCoverageFrom = jestConfig.collectCoverageFrom.concat(
      options.coveragePaths.split(' ')
    )
  }

  if (options.testEnvironment) {
    jestConfig.testEnvironment = options.testEnvironment
  }

  const stringArrayOverrides = ['setupFiles', 'testPathIgnorePatterns']

  stringArrayOverrides.forEach(option => {
    if (options[option]) {
      jestConfig[option] = options[option].split(' ')
    }
  })

  // add local package.json-level config options
  if (pkg.jest != null) {
    Object.keys(pkg.jest).forEach(key => {
      jestConfig[key] = pkg.jest[key]
    })
  }

  // jest cli params
  let jestArguments = []

  if (options.forceExit) {
    jestArguments.push('--forceExit')
  }

  if (options.updateSnapshots) {
    jestArguments.push('--updateSnapshot')
  }

  if (options.cache === false) {
    jestArguments.push('--no-cache')
  }

  if (options.runInBand || process.env.CI) {
    jestArguments.push('--runInBand')
  }

  jestArguments.push('--config', JSON.stringify(jestConfig))

  if (patterns) {
    jestArguments = jestArguments.concat(patterns)
  }

  return jestArguments
}
