/* globals afterEach, beforeEach, describe, it, expect, jasmine */
const build = require('../../lib/build')
const util = require('../test-utils/util.js')

const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

describe('build', () => {
  const mockDir = util.mockDir

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
  })
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  describe('development', () => {
    it('should transform js', (done) => {
      const results = build({
        config: {},
        files: [[`${mockDir}/index.js`]]
      })

      results[0]
        .then((buf) => {
          expect(buf.toString()).toMatchSnapshot()
          done()
        })
        .catch(done)
    })

    it('should transform css', (done) => {
      const results = build({
        config: {},
        files: [[`${mockDir}/index.css`]]
      })

      results[0]
        .then((results) => {
          expect(results.css).toMatchSnapshot()
          done()
        })
        .catch(done)
    })
  })

  describe('production', () => {
    it('should transform and minify js', (done) => {
      const results = build({
        config: {},
        env: 'production',
        files: [
          [`${mockDir}/index.js`],
          [`${mockDir}/index.css`]
        ],
        minify: true
      })

      Promise.all(results).then((output) => {
        expect(output[0].toString()).toMatchSnapshot()
        expect(output[1].css).toMatchSnapshot()
        done()
      }).catch(done)
    })
  })
})
