# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### StepFunctionOrchestrator <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestrator"></a>

Run and Evaluate AWS Cloudwatch Canaries parallel with AWS Step Functions.

State machine's execution will fail if any of the canaries fail but it will wait for all to run before failing.

#### Initializer <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestrator.Initializer"></a>

```typescript
import { StepFunctionOrchestrator } from 'synthetics-canaries-e2e-tests-runner'

new StepFunctionOrchestrator(scope: Construct, id: string, props: StepFunctionOrchestratorProps)
```

##### `scope`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestrator.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestrator.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestrator.parameter.props"></a>

- *Type:* [`synthetics-canaries-e2e-tests-runner.StepFunctionOrchestratorProps`](#synthetics-canaries-e2e-tests-runner.StepFunctionOrchestratorProps)

---



#### Properties <a name="Properties"></a>

##### `stateMachine`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestrator.property.stateMachine"></a>

- *Type:* [`@aws-cdk/aws-stepfunctions.StateMachine`](#@aws-cdk/aws-stepfunctions.StateMachine)

---


## Structs <a name="Structs"></a>

### E2ETestsStepProps <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStepProps"></a>

Construction properties for a `E2ETestsStep`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { E2ETestsStepProps } from 'synthetics-canaries-e2e-tests-runner'

const e2ETestsStepProps: E2ETestsStepProps = { ... }
```

##### `canaries`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStepProps.property.canaries"></a>

- *Type:* [`@aws-cdk/aws-synthetics.Canary`](#@aws-cdk/aws-synthetics.Canary)[]

Array of AWS Cloudwatch canary to execute in this step.

---

##### `inputsFromDeployedStack`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStepProps.property.inputsFromDeployedStack"></a>

- *Type:* [`@aws-cdk/core.CfnOutput`](#@aws-cdk/core.CfnOutput)[]

The potential list of CloudFormation outputs exposed by the App under test deployed in the previous step of the code pipeline workflow and that are needed by canaries to run properly.

Those will be pushed to AWS SSM Parameter store to be accessed by the canary at runtime
  using the name set as output ExportName.

---

##### `scope`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStepProps.property.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

Scope in wich to instantiate the state machine (usually your pipeline stack).

---

### StepFunctionOrchestratorProps <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestratorProps"></a>

Construction properties for a `StepFunctionOrchestrator`.

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { StepFunctionOrchestratorProps } from 'synthetics-canaries-e2e-tests-runner'

const stepFunctionOrchestratorProps: StepFunctionOrchestratorProps = { ... }
```

##### `canaries`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestratorProps.property.canaries"></a>

- *Type:* [`@aws-cdk/aws-synthetics.Canary`](#@aws-cdk/aws-synthetics.Canary)[]

Array of AWS Cloudwatch canary to execute.

---

## Classes <a name="Classes"></a>

### E2ETestsStep <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStep"></a>

- *Implements:* [`@aws-cdk/pipelines.ICodePipelineActionFactory`](#@aws-cdk/pipelines.ICodePipelineActionFactory)

Run AWS Cloudwatch Canaries end to end tests in parallel in the pipeline.

#### Initializer <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStep.Initializer"></a>

```typescript
import { E2ETestsStep } from 'synthetics-canaries-e2e-tests-runner'

new E2ETestsStep(id: string, props: E2ETestsStepProps)
```

##### `id`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStep.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStep.parameter.props"></a>

- *Type:* [`synthetics-canaries-e2e-tests-runner.E2ETestsStepProps`](#synthetics-canaries-e2e-tests-runner.E2ETestsStepProps)

---

#### Methods <a name="Methods"></a>

##### `produceAction` <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStep.produceAction"></a>

```typescript
public produceAction(stage: IStage, options: ProduceActionOptions)
```

###### `stage`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStep.parameter.stage"></a>

- *Type:* [`@aws-cdk/aws-codepipeline.IStage`](#@aws-cdk/aws-codepipeline.IStage)

---

###### `options`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStep.parameter.options"></a>

- *Type:* [`@aws-cdk/pipelines.ProduceActionOptions`](#@aws-cdk/pipelines.ProduceActionOptions)

---


#### Properties <a name="Properties"></a>

##### `inputsFromDeployedStack`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStep.property.inputsFromDeployedStack"></a>

- *Type:* `any`[]

---

##### `stateMachine`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStep.property.stateMachine"></a>

- *Type:* [`@aws-cdk/aws-stepfunctions.StateMachine`](#@aws-cdk/aws-stepfunctions.StateMachine)

---



