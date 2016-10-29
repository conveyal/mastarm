const AWS = require('aws-sdk')
const mime = require('mime')
const path = require('path')
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
  return ([entry, outfile]) => (
    path.extname(entry) === '.js'
    ? upload({
      body: browserify({config, entry, env, minify}).bundle(),
      bucket: s3bucket,
      cloudfront,
      outfile
    })
    : transformCss({config, entry, env, minify})
        .then((results) =>
          upload({
            body: results.css,
            bucket: s3bucket,
            cloudfront,
            outfile
          })
        )
  )
}

function upload ({
  body,
  bucket,
  cloudfront,
  outfile
}) {
  return new Promise((resolve, reject) => {
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
        if (err) reject(err)
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
            if (err) reject(err)
            done()
          })
        } else {
          done()
        }
      })

    function done () {
      console.log('finished deploying %s', outfile)
      resolve()
    }
  })
}
