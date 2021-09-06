import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as synthetics from '@aws-cdk/aws-synthetics';
import * as cdk from '@aws-cdk/core';
import * as cdkpipeline from '@aws-cdk/pipelines';
import { ICanaryInput } from './canaryInput';
import { StepFunctionOrchestrator } from './orchestrator';

/**
 * Construction properties for a `E2ETestsStep`.
 */
export interface E2ETestsStepProps {

  /**
   * Array of AWS Cloudwatch canary to execute in this step.
   */
  readonly canaries: synthetics.Canary[];

  /**
   * Scope in wich to instantiate the state machine (usually your pipeline stack).
   */
  readonly scope: cdk.Construct;

  /**
   * The potential list of CloudFormation outputs exposed by
   * the App under test deployed in the previous step of the code pipeline workflow
   * and that are needed by canaries to run properly.
   * Those will be pushed to AWS SSM Parameter store to be accessed by the canary at runtime
   *  using the name set in the ICanaryInput.
   */
  readonly inputsFromDeployedStack: ICanaryInput[];
}

/**
 * Run AWS Cloudwatch Canaries end to end tests in parallel in the pipeline
 */
export class E2ETestsStep extends cdkpipeline.Step implements cdkpipeline.ICodePipelineActionFactory {
  public readonly stateMachine: sfn.StateMachine;
  public readonly inputsFromDeployedStack: any[] = [];
  constructor(id: string, props: E2ETestsStepProps) {
    super(id);

    const e2eTestsRunner = new StepFunctionOrchestrator(props.scope, 'E2ETEstsRunner', {
      canaries: props.canaries,
    });

    this.stateMachine = e2eTestsRunner.stateMachine;
    for (const input of props.inputsFromDeployedStack) {
      const namespace = cdk.Stack.of(input.value).artifactId;
      const variableName = input.value.exportName;
      this.inputsFromDeployedStack.push({ name: input.name, value: `#{${namespace}.${variableName}}` });
    }
  }

  public produceAction(stage: codepipeline.IStage, options: cdkpipeline.ProduceActionOptions): cdkpipeline.CodePipelineActionFactoryResult {

    stage.addAction(new codepipeline_actions.StepFunctionInvokeAction({
      stateMachine: this.stateMachine,
      runOrder: options.runOrder,
      actionName: options.actionName,
      stateMachineInput: codepipeline_actions.StateMachineInput.literal(this.inputsFromDeployedStack),
    }),
    );

    return { runOrdersConsumed: 1 };
  }
}
