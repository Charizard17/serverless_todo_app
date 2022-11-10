import * as AWS from "aws-sdk";
import AWSXRay from "aws-xray-sdk-core";
import { createLogger } from "../utils/logger";

const XAWS = AWSXRay.captureAWS(AWS);
const myLogger = createLogger("bucketAccess");
const s3 = new XAWS.S3({ signatureVersion: "v4" });
const s3BucketName = process.env.S3_BUCKET_NAME;
const signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION;

export class BucketAccess {
  getPutSignedUrl(key: string) {
    const presignedUrl = s3.getSignedUrl(
      "putObject",
      {
        Bucket: s3BucketName,
        Key: key,
        Expires: parseInt(signedUrlExpiration),
      },
      function (err, _) {
        if (err) {
          myLogger.info("getPutSignedUrl, error on getting put url", {
            error: err,
          });
        } else {
          myLogger.info("getPutSignedUrl, a put url is generated", {
            presignedUrl: presignedUrl,
          });
        }
      }
    );
    return presignedUrl;
  }

  getImageUrl(imageId) {
    const url = `https://${s3BucketName}.s3.amazonaws.com/${imageId}`;
    myLogger.info("getImageUrl", { imageUrl: url });
    return url;
  }
}
