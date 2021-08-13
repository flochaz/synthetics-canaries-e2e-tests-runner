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
  with the following name's schema: <Stack Name>.<Output name>

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



