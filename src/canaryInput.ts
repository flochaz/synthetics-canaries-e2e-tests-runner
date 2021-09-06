import * as cdk from '@aws-cdk/core';

export interface ICanaryInput {
  name: string;
  value: cdk.CfnOutput;
}