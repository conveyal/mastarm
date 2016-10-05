/* globals describe, it, expect */

const testUtils = require('../../lib/test')

describe('test.js', () => {
  it('generateTestConfig should generate proper config', () => {
    const cfg = testUtils.generateTestConfig(['these', 'files', 'only'], {
      coveragePaths: 'bin src another-folder',
      updateSnapshots: true,
      cache: false,
      setupFiles: ['beforeTestsSetup.js']
    })
    expect(cfg).toBeTruthy()
    expect(cfg.length).toEqual(7)
    const jestCfg = JSON.parse(cfg.splice(3, 1))
    expect(cfg).toMatchSnapshot()
    expect(jestCfg.scriptPreprocessor).toContain('lib/jest-preprocessor.js')
    delete jestCfg.scriptPreprocessor
    expect(jestCfg).toMatchSnapshot()
  })

  it('setupTestEnvironment should set MESSAGES environment variable if needed', () => {
    testUtils.setupTestEnvironment({ messages: { hi: 'there' } })
    expect(process.env.MESSAGES).toMatchSnapshot()
  })
})
