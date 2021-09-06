const { AwsCdkConstructLibrary } = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'Florian CHAZAL',
  authorAddress: 'chazalf@amazon.com',
  cdkVersion: '1.118.0',
  defaultReleaseBranch: 'main',
  name: 'synthetics-canaries-e2e-tests-runner',
  repositoryUrl: 'https://github.com/flochaz/synthetics-canaries-e2e-tests-runner.git',
  docgen: true,
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-synthetics',
    '@aws-cdk/aws-stepfunctions',
    '@aws-cdk/aws-stepfunctions-tasks',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/pipelines',
    '@aws-cdk/aws-codepipeline-actions',
    '@aws-cdk/aws-codepipeline',
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-datapipeline',
  ],
  npmAccess: 'public',
  releaseToNpm: true,
  cdkVersionPinning: true,
  // cdkTestDependencies: undefined,    /* AWS CDK modules required for testing. */
  // deps: ['aws-sdk'], /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['aws-sdk@2.967.0', 'esbuild'] /* Build dependencies for this module. */,
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
  // release: undefined,                /* Add release management to this project. */
  // peerDeps: ['aws-sdk'],
  // bundledDeps: ['aws-sdk'],
  // tsconfig: {
  //   compilerOptions: {
  //     esModuleInterop: true,
  //   },
  // },
  keywords: ['stepFunctions', 'step-functions', 'canary', 'e2e', 'synthetics canary', 'cloudwatch synthetics'],
});

project.gitignore.addPatterns('cdk.out');

project.eslint.addOverride({
  files: ['**/**Canary**'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['**/**Canary**'],
        optionalDependencies: false,
        peerDependencies: true,
      },
    ],
  },
});

project.addTask('integ:pipeline:synth', {
  exec: 'cdk synth --app=./lib/integrationTests/integ.pipeline-blocker.js --context newStyleStackSynthesis=true',
});
project.addTask('integ:pipeline:deploy', {
  exec: 'cdk deploy --app=./lib/integrationTests/integ.pipeline-blocker.js',
});

project.synth();
