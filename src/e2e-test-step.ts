import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as synthetics from '@aws-cdk/aws-synthetics';
import * as cdk from '@aws-cdk/core';
import * as cdkpipeline from '@aws-cdk/pipelines';
import { StepFunctionOrchestrator } from './orchestrator';

export interface E2ETestsStepProps {

  canaries: synthetics.Canary[];
  scope: cdk.Construct;
  inputsFromDeployedStack: cdk.CfnOutput[];
}

export default class E2ETestsStep extends cdkpipeline.Step implements cdkpipeline.ICodePipelineActionFactory {
  public readonly stateMachine: sfn.StateMachine;
  public readonly inputsFromDeployedStack: any[] = [];
  constructor(id: string, props: E2ETestsStepProps) {
    super(id);

    const e2eTestsRunner = new StepFunctionOrchestrator(props.scope, 'E2ETEstsRunner', {
      canaries: props.canaries,
    });

    this.stateMachine = e2eTestsRunner.stateMachine;
    for (const cfnOutput of props.inputsFromDeployedStack) {
      this.inputsFromDeployedStack.push({ name: `${cdk.Stack.of(cfnOutput).stackName}.${cfnOutput.exportName}`, value: `#{${cdk.Stack.of(cfnOutput).stackName}.${cfnOutput.exportName}}` }); // TODO: Add type
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
