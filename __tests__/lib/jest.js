/* globals describe, it, expect */

const jestUtils = require('../../lib/jest')

const EXPECTED_ARGUMENT_LENGTH = 8
const JEST_CONFIG_INDEX = 4

describe('test.js', () => {
  it('generateTestConfig should generate proper config', () => {
    const cfg = jestUtils.generateTestConfig(['these', 'files', 'only'], {
      cache: false,
      coveragePaths: 'bin src another-folder',
      runInBand: true,
      setupFiles: 'beforeTestsSetup.js',
      testEnvironment: 'node',
      updateSnapshots: true
    })
    expect(cfg).toBeTruthy()
    expect(cfg.length).toEqual(EXPECTED_ARGUMENT_LENGTH)
    const jestCfg = JSON.parse(cfg.splice(JEST_CONFIG_INDEX, 1))
    expect(cfg).toMatchSnapshot()
    expect(jestCfg.transform['.*']).toContain('lib/jest-preprocessor.js')
    delete jestCfg.transform
    expect(jestCfg).toMatchSnapshot()
  })
})
