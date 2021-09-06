import * as apigateway from '@aws-cdk/aws-apigateway';
import * as cdk from '@aws-cdk/core';
import * as cdkpipeline from '@aws-cdk/pipelines';
import { E2ETestsStep } from '../';
import { E2ETestsCanaries } from './e2e-tests-canaries';
const mockApp = new cdk.App();

/**
 * Stack to hold the pipeline
 */
class MyPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new cdkpipeline.CodePipeline(this, 'Pipeline', {
      selfMutation: false,
      synth: new cdkpipeline.ShellStep('Synth', {
        // Use a connection created using the AWS console to authenticate to GitHub
        // Other sources are available.
        input: cdkpipeline.CodePipelineSource.connection('flochaz/synthetics-canaries-e2e-tests-runner', 'test', {
          connectionArn:
            'arn:aws:codestar-connections:eu-west-1:036129959679:connection/c92f72f6-1838-49f7-be70-3cd461dbb227', // Created using the AWS console
        }),
        commands: [
          'npm install -g aws-cdk',
          'npm install',
          'npm run build',
          'cdk synth --app=./lib/integ.pipeline-blocker.js',
        ],
      }),
    });

    // 'MyApplication' is defined below. Call `addStage` as many times as
    // necessary with any account and region (may be different from the
    // pipeline's).
    const myAppStage = new MyApplicationStage(this, 'Demo', {});
    const demoStage = pipeline.addStage(myAppStage);

    const e2eTestsCanaries = new E2ETestsCanaries(this, 'E2ETestsCanaries');
    const e2eTestsRunnerStep = new E2ETestsStep('E2ETestsRunner', {
      scope: this,
      canaries: e2eTestsCanaries.canaries,
      inputsFromDeployedStack: [
        myAppStage.demoApiUrlCfnOutput,
      ],
    });
    demoStage.addPost(e2eTestsRunnerStep);

    // Workaround of https://github.com/aws/aws-cdk/issues/16036
    demoStage.addPost(
      new cdkpipeline.ShellStep('Force namespace setup', {
        envFromCfnOutputs: {
          // Make the load balancer address available as $URL inside the commands
          URL: myAppStage.demoApiUrlCfnOutput,
        },
        commands: ['echo "CDK issue #16036 workaround"'],
      }),
    );
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
class MyApplicationStage extends cdk.Stage {
  public readonly demoApi: apigateway.RestApi;
  public readonly demoApiUrlCfnOutput: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const demoAppStack = new cdk.Stack(this, 'testing-stack');

    this.demoApi = new apigateway.RestApi(demoAppStack, 'demoAppApi');
    const mockedResource = this.demoApi.root.addResource('users').addResource('{userId}', {
      defaultCorsPreflightOptions: {
        allowOrigins: ['*'],
        allowCredentials: true,
      },
    });

    const findPlayerMockIntegration = new apigateway.MockIntegration({
      passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_TEMPLATES,
      requestTemplates: {
        'application/json': `{
             #if( $input.params('userId') == 999999999)
                    "statusCode" : 404
              #else
                     "statusCode" : 200
              #end
          }`,
      },
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            'application/json': ` 
                     { "name": "John",
                       "id": input.params('playerId'),
                       "surname": "Doe", 
                       "sex": "male",
                       "city": "Hamburg"
                       "registrationDate": 1598274405
                     }`,
          },
        },
        {
          statusCode: '404',
          selectionPattern: '404',
          responseTemplates: {
            'application/json': '{"error": "Player ($input.params(\'userId\')) not found"}',
          },
        },
      ],
    });

    const findPlayerMethodOptions = {
      methodResponses: [
        {
          statusCode: '200',
          responseModels: {
            'application/json': apigateway.Model.EMPTY_MODEL,
          },
        },
        {
          statusCode: '404',
          responseModels: {
            'application/json': apigateway.Model.ERROR_MODEL,
          },
        },
      ],
    };

    mockedResource.addMethod('GET', findPlayerMockIntegration, findPlayerMethodOptions);

    this.demoApiUrlCfnOutput = new cdk.CfnOutput(demoAppStack, 'DemoApiUrl', {
      value: this.demoApi.url,
      exportName: 'DemoApiUrl',
    });
  }
}

// In your main file
new MyPipelineStack(mockApp, 'PipelineStack', {});
