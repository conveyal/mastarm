// @flow

const jestUtils = require('../../lib/jest')

const JEST_CONFIG_INDEX = 4

describe('jest.js', () => {
  it('generateTestConfig should generate proper config', () => {
    const cfg = jestUtils.generateTestConfig(['these', 'files', 'only'], {
      cache: false,
      coveragePaths: 'bin src another-folder',
      runInBand: true,
      setupFiles: 'beforeTestsSetup.js',
      testEnvironment: 'node',
      updateSnapshots: true
    })
    cfg[JEST_CONFIG_INDEX] = JSON.parse(cfg[JEST_CONFIG_INDEX])
    expect(cfg[JEST_CONFIG_INDEX].transform['.*']).toContain(
      'lib/jest-preprocessor.js'
    )
    delete cfg[JEST_CONFIG_INDEX].transform
    expect(cfg).toMatchSnapshot()
  })
})
