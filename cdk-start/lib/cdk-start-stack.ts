import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
//import { Duration } from 'aws-cdk-lib';
import { CfnOutput, Duration } from "aws-cdk-lib";
import { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    new Bucket(this, "L3Bucket", {
      lifecycleRules: [
        {
          expiration: Duration.days(expiration),
        },
      ],
    });
  }
}

export class CdkStartStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 Bucket - Storage
    new CfnBucket(this, "MyL1Bucket", {
      lifecycleConfiguration: {
        rules: [
          {
            expirationInDays: 1,
            status: "Enabled",
          },
        ],
      },
    });

    const duration = new cdk.CfnParameter(this, "durration", {
      default: 6,
      minValue: 1,
      maxValue: 12,
      type: "Number",
    });

    const myL2Bucket = new Bucket(this, "MyL2Bucket", {
      lifecycleRules: [
        {
          expiration: Duration.days(duration.valueAsNumber),
        },
      ],
      // Run on destroy command to cleanly wipe
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    new CfnOutput(this, "MyL2BucketName", {
      value: myL2Bucket.bucketName,
    });

    new L3Bucket(this, "MyL3Bucket", 3);
  }
}
