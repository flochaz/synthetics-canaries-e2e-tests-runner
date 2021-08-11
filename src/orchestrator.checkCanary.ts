import * as synthetics from '@aws-cdk/aws-synthetics';
import * as AWS from 'aws-sdk';
import CanaryFailedError from './CanaryFailedError';

const synthteticsClient = new AWS.Synthetics();


exports.handler = async (event: synthetics.Canary): Promise<AWS.Synthetics.CanaryRunStatus> => {

  let result: AWS.Synthetics.CanaryRunStatus =
  { State: 'RUNNING' };
  try {
    console.log(`check canary ${event.canaryName}`);
    const runs = await synthteticsClient.getCanaryRuns({
      Name: event.canaryName,
      MaxResults: 1,
    }).promise();
    if (!runs.CanaryRuns || runs.CanaryRuns.length === 0) {
      console.error(`No run found for canary ${event.canaryName}`);
      throw new Error(`No run found for canary ${event.canaryName}`);
    }
    console.log(`result: ${JSON.stringify(runs.CanaryRuns[0])}`);
    result = runs.CanaryRuns[0]!.Status!;
    if (result.State === 'FAILED') {
      throw new CanaryFailedError(result.StateReason!);
    }
  } catch (error) {
    console.error(`Something went wrong checking ${event.canaryName}: ${error}`);
    throw new Error(error);
  }
  return result;
};

