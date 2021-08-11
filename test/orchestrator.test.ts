import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as synthetics from '@aws-cdk/aws-synthetics';
import * as cdk from '@aws-cdk/core';
import { StepFunctionOrchestrator } from '../src';
test('minimal usage', () => {
  // GIVEN
  const stack = new cdk.Stack();

  const canary = new synthetics.Canary(stack, 'MyCanary', {
    schedule: synthetics.Schedule.rate(cdk.Duration.minutes(5)),
    test: synthetics.Test.custom({
      code: synthetics.Code.fromInline('console.log("Hello World!");'),
      handler: 'index.handler',
    }),
    runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
  });


  // WHEN
  new StepFunctionOrchestrator(stack, 'stepFunctionOrchestrator', {
    canaries: [canary],
  });

  // THEN
  expect(SynthUtils.synthesize(stack).template).toMatchSnapshot();
});