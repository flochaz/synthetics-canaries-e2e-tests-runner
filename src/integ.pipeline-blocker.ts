import * as synthetics from '@aws-cdk/aws-synthetics';
import * as cdk from '@aws-cdk/core';
import * as cdkpipeline from '@aws-cdk/pipelines';
// import E2ETestsStep from './e2e-test-step';

const mockApp = new cdk.App();


/**
 * Stack to hold the pipeline
 */
class MyPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new cdkpipeline.CodePipeline(this, 'Pipeline', {
      synth: new cdkpipeline.ShellStep('Synth', {
        // Use a connection created using the AWS console to authenticate to GitHub
        // Other sources are available.
        input: cdkpipeline.CodePipelineSource.connection('flochaz/synthetics-canaries-e2e-tests-runner', 'test', {
          connectionArn: 'arn:aws:codestar-connections:eu-west-1:036129959679:connection/c92f72f6-1838-49f7-be70-3cd461dbb227', // Created using the AWS console * });',
        }),
        commands: [
          'npx projen build',
          'cdk synth --app=./lib/integ.pipeline-blocker.js',
        ],
      }),
    });

    // 'MyApplication' is defined below. Call `addStage` as many times as
    // necessary with any account and region (may be different from the
    // pipeline's).
    const myApp = new MyApplication(this, 'Demo', {});

    // const e2eTestsRunnerStep = new E2ETestsStep(this, myApp.canaries, 'E2ETestsRunner');

    pipeline.addStage(myApp);
  }
}

/**
 * Your application
 *
 * May consist of one or more Stacks (here, two)
 *
 * By declaring our DatabaseStack and our ComputeStack inside a Stage,
 * we make sure they are deployed together, or not at all.
 */
class MyApplication extends cdk.Stage {
  public readonly canaries: synthetics.Canary[] = [];

  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const e2eTestsStack = new cdk.Stack(this, 'testing-stack');


    this.canaries.push(new synthetics.Canary(e2eTestsStack, 'Test_1', {
      canaryName: 'test-1',
      schedule: synthetics.Schedule.once(),
      test: synthetics.Test.custom({
        code: synthetics.Code.fromInline('exports.handler = function(event) { console.log("hi 1"); }'),
        handler: 'index.handler',
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
    }));

    this.canaries.push(new synthetics.Canary(e2eTestsStack, 'Test_2', {
      canaryName: 'test_2',
      schedule: synthetics.Schedule.once(),
      test: synthetics.Test.custom({
        code: synthetics.Code.fromInline('exports.handler = function(event, ctx, cb) { return cb(null, "hi 2"); }'),
        handler: 'index.handler',
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
    }));
  }
}

// In your main file
new MyPipelineStack(mockApp, 'PipelineStack', {});