import * as synthetics from '@aws-cdk/aws-synthetics';
import * as cdk from '@aws-cdk/core';
import { StepFunctionOrchestrator } from '../';
const mockApp = new cdk.App();
const stack = new cdk.Stack(mockApp, 'testing-stack');


const test_1 = new synthetics.Canary(stack, 'Test_1', {
  canaryName: 'test-1',
  schedule: synthetics.Schedule.once(),
  test: synthetics.Test.custom({
    code: synthetics.Code.fromInline('exports.handler = function(event) { console.log(`hi ${process.env.DemoApiUrl} `); }'),
    handler: 'index.handler',
  }),
  runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
});

const test_2 = new synthetics.Canary(stack, 'Test_2', {
  canaryName: 'test_2',
  schedule: synthetics.Schedule.once(),
  test: synthetics.Test.custom({
    code: synthetics.Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi 2"); }'),
    handler: 'index.handler',
  }),
  runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
});

new StepFunctionOrchestrator(stack, 'stepFunctionOrchestrator', {
  canaries: [test_1, test_2],
});