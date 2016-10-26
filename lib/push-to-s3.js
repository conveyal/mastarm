const AWS = require('aws-sdk')
const fs = require('fs')
const mime = require('mime')
const uuid = require('uuid')

const browserify = require('./browserify')
const transformCss = require('./css-transform')

module.exports = function ({
  cloudfront,
  config,
  env,
  minify,
  s3bucket
}) {
  console.log('pushing to s3bucket:', s3bucket, '>cloudfront:', cloudfront, '>env:', env, '>minified:', Boolean(minify))
  return function run ([entry, outfile]) {
    const fileExtension = entry.split('.').pop()
    if (fileExtension === 'js') {
      const bundle = browserify({
        config,
        entry,
        env,
        minify,
        outfile
      }).bundle()

      upload({
        body: bundle,
        bucket: s3bucket,
        cloudfront,
        outfile
      })
    } else if (fileExtension === 'css') {
      transformCss({
        configPath: config.path,
        entry,
        outfile
      })
      upload({
        body: fs.createReadStream(outfile),
        bucket: s3bucket,
        cloudfront,
        outfile
      })
    }
  }
}

function upload ({
  body,
  bucket,
  cloudfront,
  outfile
}) {
  const s3object = new AWS.S3({
    params: {
      ACL: 'public-read',
      Body: body,
      Bucket: bucket,
      ContentType: mime.lookup(outfile),
      Key: outfile
    }
  })

  console.log('building and pushing %s to s3 bucket %s', outfile, bucket)
  s3object
    .upload()
    .send(function (err, data) {
      if (err) { return handleErr(err) }

      console.log('finished pushing %s to s3', outfile)

      if (cloudfront) {
        const cf = new AWS.CloudFront()
        console.log('creating invalidation for cf distribution %s at %s', cloudfront, outfile)
        cf.createInvalidation({
          DistributionId: cloudfront,
          InvalidationBatch: {
            CallerReference: uuid.v4(),
            Paths: {
              Quantity: 1,
              Items: [
                '/' + outfile
              ]
            }
          }
        }, function (err, data) {
          if (err) { return handleErr(err) }
          done()
        })
      } else {
        done()
      }
    })

  function done () {
    console.log('finished deploying %s', outfile)
  }
}

function handleErr (err) {
  console.error(err.stack)
  process.exit(1)
}
