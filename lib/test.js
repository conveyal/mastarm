const path = require('path')

module.exports.generateTestConfig = (patterns, options) => {
  // jest config params
  const jestConfig = {
    cacheDirectory: 'tmp',
    collectCoverage: options.coverage,
    collectCoverageFrom: ['lib/**/*.js'],
    coverageDirectory: 'coverage',
    scriptPreprocessor: path.resolve(__dirname, 'jest-preprocessor.js')
  }

  if (options.coveragePaths) {
    jestConfig.collectCoverageFrom = jestConfig.collectCoverageFrom.concat(options.coveragePaths.split(' '))
  }

  if (options.setupFiles) {
    jestConfig.setupFiles = options.setupFiles
  }

  // jest cli params
  let jestArguments = []
  if (options.updateSnapshots) {
    jestArguments.push('-u')
  }

  if (options.cache === false) {
    jestArguments.push('--no-cache')
  }

  jestArguments.push('--config', JSON.stringify(jestConfig))

  if (patterns) {
    jestArguments = jestArguments.concat(patterns)
  }
  return jestArguments
}

module.exports.setupTestEnvironment = (config) => {
  if (config.messages) {
    process.env.MESSAGES = JSON.stringify(config.messages)
  }
}
