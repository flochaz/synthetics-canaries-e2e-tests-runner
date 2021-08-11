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





## Structs <a name="Structs"></a>

### StepFunctionOrchestratorProps <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestratorProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { StepFunctionOrchestratorProps } from 'synthetics-canaries-e2e-tests-runner'

const stepFunctionOrchestratorProps: StepFunctionOrchestratorProps = { ... }
```

##### `canaries`<sup>Required</sup> <a name="synthetics-canaries-e2e-tests-runner.StepFunctionOrchestratorProps.property.canaries"></a>

- *Type:* [`@aws-cdk/aws-synthetics.Canary`](#@aws-cdk/aws-synthetics.Canary)[]

---



