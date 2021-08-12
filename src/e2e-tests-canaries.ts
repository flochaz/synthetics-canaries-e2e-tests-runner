import * as synthetics from '@aws-cdk/aws-synthetics';
import * as cdk from '@aws-cdk/core';

export interface E2ETestsCanariesProps {
  endpointUnderTest: string;
}

export class E2ETestsCanaries extends cdk.Construct {
  public readonly canaries: synthetics.Canary[] = [];
  constructor(scope: cdk.Construct, id: string, props: E2ETestsCanariesProps) {
    super(scope, id);


    this.canaries.push(new synthetics.Canary(this, 'Test_1', {
      canaryName: 'test-1',
      schedule: synthetics.Schedule.once(),
      test: synthetics.Test.custom({
        code: synthetics.Code.fromInline('exports.handler = function(event) { console.log(`Will test ${process.env.ENDPOINT_UNDER_TEST}`); }'),
        handler: 'index.handler',
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
      environmentVariables: {
        ENDPOINT_UNDER_TEST: props.endpointUnderTest,
      },
    }));

    this.canaries.push(new synthetics.Canary(this, 'Test_2', {
      canaryName: 'test_2',
      schedule: synthetics.Schedule.once(),
      test: synthetics.Test.custom({
        code: synthetics.Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi 2"); }'),
        handler: 'index.handler',
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
      environmentVariables: {
        ENDPOINT_UNDER_TEST: props.endpointUnderTest,
      },
    }));

  }
}