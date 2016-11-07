/* globals afterEach, beforeEach, describe, it, jasmine, expect */

const exec = require('child_process').exec
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const rimraf = require('rimraf')

const util = require('../test-utils/util.js')

const mastarm = path.resolve(__dirname, '../../bin/mastarm')

const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL

describe('mastarm cli', () => {
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000
  })
  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
  })

  it('should display usage with no args', (done) => {
    exec(`node ${mastarm} --help`, (err, stdout, stderr) => {
      expect(err).toBeNull()
      expect(stdout).toContain('Usage: mastarm [options] [command]')
      expect(stderr).toBe('')
      done()
    })
  })

  describe('build', function () {
    const buildDir = util.buildDir
    const mockDir = util.mockDir

    beforeEach((done) => mkdirp(buildDir, done))
    afterEach((done) => rimraf(buildDir, done))

    it('should build a project', (done) => {
      exec(`node ${mastarm} build ${mockDir}/index.js:${buildDir}/index.js ${mockDir}/index.css:${buildDir}/index.css`,
        (err, stdout, stderr) => {
          expect(err).toBeNull()
          expect(stdout).toBe('')
          expect(stderr).toBe('')
          expect(fs.existsSync(`${buildDir}/index.js`)).toBeTruthy()
          expect(fs.existsSync(`${buildDir}/index.css`)).toBeTruthy()
          done()
        }
      )
    })
  })

  describe('prepublish', function () {
    const buildDir = util.buildDir
    const mockDir = util.mockDir

    beforeEach((done) => mkdirp(buildDir, done))
    afterEach((done) => rimraf(buildDir, done))

    it('should prepublish a project', (done) => {
      exec(`node ${mastarm} prepublish ${mockDir}:${buildDir}`,
        (err, stdout, stderr) => {
          expect(err).toBeNull()
          expect(stdout).toBe('')
          expect(stderr).toBe('')
          expect(fs.existsSync(`${buildDir}/index.js`)).toBeTruthy()
          done()
        }
      )
    })
  })

  it('should run lint on a project', (done) => {
    exec(`node ${mastarm} lint`, (err, stdout, stderr) => {
      expect(err).toBeNull()
      expect(stdout).toBe('')
      expect(stderr).toBe('')
      done()
    })
  })
})
