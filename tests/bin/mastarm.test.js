/* globals afterEach, beforeEach, describe, it, expect */

const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')

const mastarm = path.resolve('./bin/mastarm')

const util = require('../util.js')

describe('mastarm cli', () => {
  it('should display usage with no args', (done) => {
    exec(`node ${mastarm} --help`, (err, stdout, stderr) => {
      expect(err).toBeNull()
      expect(stdout).toContain('Usage: mastarm [options] [command]')
      expect(stderr).toBe('')
      done()
    })
  })

  describe('build', function () {
    const buildFilePattern = 'built-bin-build'
    const cleanFn = util.makeCleanBuiltFilesFn(buildFilePattern)
    beforeEach(cleanFn)
    afterEach(cleanFn)

    it('should build a project', (done) => {
      exec(`node ${mastarm} build tests/mocks/mockComponent.js:tests/mocks/${buildFilePattern}.js tests/mocks/mock.css:tests/mocks/${buildFilePattern}.css`,
        (err, stdout, stderr) => {
          expect(err).toBeNull()
          expect(stdout).toBe('')
          expect(stderr).toBe('')
          expect(fs.existsSync(`tests/mocks/${buildFilePattern}.js`)).toBeTruthy()
          expect(fs.existsSync(`tests/mocks/${buildFilePattern}.css`)).toBeTruthy()
          done()
        }
      )
    })
  })

  it('should run lint on a project', (done) => {
    exec(`node ${mastarm} lint --ignore tests/mocks/built*`, (err, stdout, stderr) => {
      expect(err).toBeNull()
      expect(stdout).toBe('')
      expect(stderr).toBe('')
      done()
    })
  })
})
