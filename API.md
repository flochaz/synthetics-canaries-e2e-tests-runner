# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### StepFunctionOrchestrator <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestrator"></a>

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

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { E2ETestsStepProps } from 'synthetics-canaries-e2e-tests-runner'

const e2ETestsStepProps: E2ETestsStepProps = { ... }
```

##### `canaries`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStepProps.property.canaries"></a>

- *Type:* [`@aws-cdk/aws-synthetics.Canary`](#@aws-cdk/aws-synthetics.Canary)[]

---

##### `inputsFromDeployedStack`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStepProps.property.inputsFromDeployedStack"></a>

- *Type:* [`@aws-cdk/core.CfnOutput`](#@aws-cdk/core.CfnOutput)[]

---

##### `scope`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.E2ETestsStepProps.property.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

### StepFunctionOrchestratorProps <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestratorProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { StepFunctionOrchestratorProps } from 'synthetics-canaries-e2e-tests-runner'

const stepFunctionOrchestratorProps: StepFunctionOrchestratorProps = { ... }
```

##### `canaries`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestratorProps.property.canaries"></a>

- *Type:* [`@aws-cdk/aws-synthetics.Canary`](#@aws-cdk/aws-synthetics.Canary)[]

---



