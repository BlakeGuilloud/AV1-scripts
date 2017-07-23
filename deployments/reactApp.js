module.exports = (...args) => {
  
  const [bucketArg, profile] = args;
  const AWS = require('aws-sdk');
  AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: profile || 'av1' });
  const s3 = new AWS.S3();
  const fs = require('fs');
  const mime = require('mime');

  deployReactApp(bucketArg);

  function deployReactApp(Bucket = 'av1.io') {
    s3.createBucket({ Bucket }, (err) => {
      if (err) throw err;

      writeObjectsToS3(Bucket);
      // putBucketWebsite(Bucket);

      console.log(`React App was deployed to Bucket: ${Bucket}`);
    });
  }

  function putBucketWebsite(Bucket) {
    const params = fetchBucketWebsiteParams(Bucket);
  }

  // function fetchBucketWebsiteParams(Bucket) {
  //   return {
  //     Bucket,
  //     WebsiteConfiguration:
  //   }
  // }

  function writeObjectsToS3(Bucket) {
    const fileStructure = generateFileStructure(fetchRootFileStructure(), readAssetManifest());

    for (let prop in fileStructure) {
      putObject(Bucket, fileStructure[prop]);
    }
  }

  function putObject(Bucket, objectKey) {
    s3.putObject(fetchObjectParams(Bucket, objectKey), (err) => {
      if (err) throw err;
    });
  }

  function fetchObjectParams(Bucket, objectKey) {
    return {
      Bucket,
      Key: objectKey,
      Body: fetchObjectBody(objectKey),
      ContentType: fetchObjectContentType(objectKey),
      WebsiteConfiguration: {
        ErrorDocument: {
          Key: "index.html"
        }, 
        IndexDocument: {
          Suffix: "index.html"
        }
      }
    };
  }

  function fetchObjectBody(object) {
    const filePath = `build/${object}`;

    return fs.readFileSync(filePath);
  }

  function fetchObjectContentType(object) {
    const filePath = `build/${object}`;

    return mime.lookup(filePath);
  }

  function generateFileStructure(rootFileStructure, manifest) {
    const returnVal = rootFileStructure;

    for (let prop in manifest) {
      returnVal[prop] = manifest[prop];
    }

    return returnVal;
  }

  function fetchRootFileStructure() {
    return {
      'index.html': 'index.html',
      'favicon.ico': 'favicon.ico',
      'asset-manifest.json': 'asset-manifest.json',
      'manifest.json': 'manifest.json',
      'service-worker.js': 'service-worker.js',
    };
  }

  function readAssetManifest() {
    const file = fs.readFileSync('./build/asset-manifest.json', 'utf8');

    return JSON.parse(file);
  }
};
