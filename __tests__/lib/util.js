/* globals describe, expect, it, jest */

jest.mock('../../lib/pkg', () => { return {} })

const util = require('../../lib/util')
const testUtils = require('../test-utils/util')
const mockDir = testUtils.mockDir

describe('util.js', () => {
  it('configureEnvironment should set process.env vars', () => {
    const env2 = 'mock-env2'
    const messages = { hi: 'there' }
    const settings = { someSetting: true }
    const store = {}
    const config = {
      env: 'mock-env',
      path: '/made/up/path',
      messages,
      settings,
      store
    }
    util.configureEnvironment({ config, env: env2 })
    expect(process.env.NODE_ENV).toEqual(env2)
    expect(JSON.parse(process.env.MESSAGES)).toEqual(messages)
    expect(JSON.parse(process.env.SETTINGS)).toEqual(settings)
    expect(JSON.parse(process.env.STORE)).toEqual(store)
  })

  it('makeGetFn should find the right value', () => {
    expect(util.makeGetFn([{ a: 1 }, { a: 2 }])('a')).toEqual(1)
  })

  describe('parseEntries', () => {
    const get = () => null
    it('should try to find default file paths', () => {
      const result = util.parseEntries([], get)
      expect(result.length).toBe(0)
      expect(result).toMatchSnapshot()
    })

    it('should return inputted file paths', () => {
      const result = util.parseEntries([`${mockDir}/index.css:blah`, `${mockDir}/index.js:blah`], get)
      expect(result.length).toBe(2)
      expect(result).toMatchSnapshot()
    })
  })

  describe('assertEntriesExist', () => {
    it('should not throw an error if entries exist', () => {
      util.assertEntriesExist([[`${mockDir}/index.js`]])
    })

    it('should throw error if the entry does not exist', () => {
      expect(() => util.assertEntriesExist([['fileDoesNotExist']])).toThrow()
    })
  })

  it('popMastarmFromArgv should remove the mastarm command', () => {
    const argv1 = process.argv[1]
    expect(argv1).toContain('mastarm')
    util.popMastarmFromArgv()
    expect(process.argv[1]).not.toBe(argv1)
  })
})
