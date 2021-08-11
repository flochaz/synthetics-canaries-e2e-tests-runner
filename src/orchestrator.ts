import { PolicyStatement } from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda-nodejs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as tasks from '@aws-cdk/aws-stepfunctions-tasks';
import * as synthetics from '@aws-cdk/aws-synthetics';
import * as cdk from '@aws-cdk/core';

export interface StepFunctionOrchestratorProps {
  readonly canaries: synthetics.Canary[];
}

const WAIT_TIME_BETWEEN_CANARY_RUN_CHECK_CALL_IN_SENCONDS = 10;

export class StepFunctionOrchestrator extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: StepFunctionOrchestratorProps) {
    super(scope, id);

    const startCanaryLambda = new lambda.NodejsFunction(this, 'startCanary');
    const getCanaryRunStatusLambda = new lambda.NodejsFunction(this, 'checkCanary');

    startCanaryLambda.addToRolePolicy(new PolicyStatement({resources: ['*'], actions: ['synthetics:StartCanary']}));
    getCanaryRunStatusLambda.addToRolePolicy(new PolicyStatement({resources: ['*'], actions: ['synthetics:GetCanaryRuns']}));

    const parallelCanariesRun = new sfn.Parallel(this, 'parallel');
    for(const canaryIndex in props.canaries) {
    const canary = props.canaries[canaryIndex];
    const cfnCanary = canary.node.defaultChild as synthetics.CfnCanary;
    cfnCanary.addPropertyOverride('Schedule.Expression', 'rate(0 minute)');

    const startCanaryTask = new tasks.LambdaInvoke(this, `Start (${canaryIndex})`, {
      payload: sfn.TaskInput.fromObject({
        canaryName: canary.canaryName,
      }),
      lambdaFunction: startCanaryLambda,
    });
    startCanaryTask.addPrefix(`${canary.canaryName} - `);

    const waitX = new sfn.Wait(this, `Wait ${WAIT_TIME_BETWEEN_CANARY_RUN_CHECK_CALL_IN_SENCONDS}s (${canaryIndex})`, {
      time: sfn.WaitTime.duration(cdk.Duration.seconds(WAIT_TIME_BETWEEN_CANARY_RUN_CHECK_CALL_IN_SENCONDS)),
    });
    waitX.addPrefix(`${canary.canaryName} - `);

    // Return the latest Canary run Status
    // @see https://docs.aws.amazon.com/AmazonSynthetics/latest/APIReference/API_CanaryRunStatus.html
    const getStatus = new tasks.LambdaInvoke(this, `Get Status (${canaryIndex})`, {
      payload: sfn.TaskInput.fromObject({
        canaryName: canary.canaryName,
      }),
      lambdaFunction: getCanaryRunStatusLambda,
      outputPath: '$.Payload'
    });
    getStatus.addPrefix(`${canary.canaryName} - `);

    const canaryRunFailed = new sfn.Pass(this, `Silent fail (${canaryIndex})`, {
      comment: '$.StateReason',
    });
    canaryRunFailed.addPrefix(`${canary.canaryName} - `);
    getStatus.addCatch(canaryRunFailed, {errors: ['States.ALL'], resultPath: '$.State'});

    const canaryRunPassed = new sfn.Pass(this, `Canary ${canaryIndex} run Passed`);
    canaryRunPassed.addPrefix(`${canary.canaryName} - `);
    // TODO: add link to canary https://eu-west-1.console.aws.amazon.com/cloudwatch/home?region=eu-west-1#synthetics:canary/detail/test-1

    const checkPassedState = new sfn.Choice(this, `Canary  Passed ? (${canaryIndex})`)
    .when(sfn.Condition.stringEquals('$.State', 'PASSED'), canaryRunPassed)
    .otherwise(waitX)
    checkPassedState.addPrefix(`${canary.canaryName} - `);
    
    const startAndCheckCanaryRun = startCanaryTask
      .next(waitX)
      .next(getStatus)
      .next(checkPassedState);
    
      parallelCanariesRun.branch(startAndCheckCanaryRun);
  }


  const canariesRunFailed = new sfn.Fail(this, 'Fail');


  const canariesRunPassed = new sfn.Pass(this, `Pass`);


  const checkResult = new sfn.Choice(this, 'Double check result');

  checkResult.when(sfn.Condition.stringEquals('$.State', 'PASSED'), canariesRunPassed);
  checkResult.otherwise(canariesRunFailed);

  
  const checkResultMap = new sfn.Map(this, 'checkResults');
  checkResultMap.iterator(checkResult);
  
  const definition = parallelCanariesRun.next(checkResultMap);

    new sfn.StateMachine(this, 'StateMachine', {
      definition,
      timeout: cdk.Duration.minutes(15), // Matching max canary timeout of 15 minutes
    });

  }
}

// TODO: Add run in pipeline
// TODO: Add run in stack => cdk-triggers
