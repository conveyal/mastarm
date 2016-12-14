/* globals describe, it, expect */

const testUtils = require('../../lib/test')

describe('test.js', () => {
  it('generateTestConfig should generate proper config', () => {
    const cfg = testUtils.generateTestConfig(['these', 'files', 'only'], {
      cache: false,
      coveragePaths: 'bin src another-folder',
      setupFiles: 'beforeTestsSetup.js',
      testEnvironment: 'node',
      updateSnapshots: true
    })
    expect(cfg).toBeTruthy()
    expect(cfg.length).toEqual(7)
    const jestCfg = JSON.parse(cfg.splice(3, 1))
    expect(cfg).toMatchSnapshot()
    expect(jestCfg.transform['.*']).toContain('lib/jest-preprocessor.js')
    delete jestCfg.transform
    expect(jestCfg).toMatchSnapshot()
  })
})
