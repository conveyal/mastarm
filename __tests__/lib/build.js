/* globals afterEach, beforeEach, describe, it, expect, jasmine */

const build = require('../../lib/build')
const util = require('../test-utils/util.js')

const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL
const TWENTY_SECONDS = 20000

describe('build', () => {
  const mockDir = util.mockDir

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TWENTY_SECONDS
  })
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  describe('development', () => {
    it('should transform js', () => {
      const [jsResults] = build({
        config: {},
        files: [[`${mockDir}/index.js`]]
      })

      return jsResults
        .then((buf) => {
          expect(buf.toString().includes('MockTestComponentUniqueName')).toBeTruthy()
        })
    })

    it('should transform css', async () => {
      const [cssResults] = build({
        config: {},
        files: [[`${mockDir}/index.css`]]
      })

      const result = await cssResults
      const css = result.css
      expect(css.includes('criticalClass')).toBeTruthy()
    })
  })

  describe('production', () => {
    it('should transform and minify js', async () => {
      const results = build({
        config: {},
        env: 'production',
        files: [
          [`${mockDir}/index.js`],
          [`${mockDir}/index.css`]
        ],
        minify: true
      })

      const [jsOutput, cssOutput] = await Promise.all(results)

      expect(jsOutput.toString().includes('MockTestComponentUniqueName')).toBeTruthy()
      expect(cssOutput.css.includes('criticalClass')).toBeTruthy()
    })
  })
})
