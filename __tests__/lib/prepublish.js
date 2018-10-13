// @flow

const mkdirp = require('mkdirp')
const rimraf = require('rimraf')

const prepublish = require('../../lib/prepublish')
const util = require('../../lib/util')
const {buildDir, mockDir} = require('../test-utils/util.js')

describe('prepublish', () => {
  beforeEach(done => mkdirp(buildDir, done))
  afterEach(done => rimraf(buildDir, done))

  it('should transpile a directory of files', () => {
    const results = prepublish({
      entries: util.parseEntries([`${mockDir}:${buildDir}`]),
      env: 'development'
    })

    expect(results).toHaveLength(2)
  })

  it('should transpile a directory of files to a specific outdir', () => {
    const results = prepublish({
      entries: util.parseEntries([mockDir]),
      env: 'development',
      outdir: buildDir
    })

    expect(results).toHaveLength(2)
  })

  it('should transpile entries', () => {
    const results = prepublish({
      entries: util.parseEntries([`${mockDir}/index.js:${buildDir}/index.js`]),
      env: 'development'
    })

    expect(results).toHaveLength(1)
  })

  it('should transpile entries to a specific outdir', () => {
    const results = prepublish({
      entries: util.parseEntries([`${mockDir}/index.js`]),
      env: 'development',
      outdir: buildDir
    })

    expect(results).toHaveLength(1)
  })
})
