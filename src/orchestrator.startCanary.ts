import * as AWS from 'aws-sdk';
const synthteticsClient = new AWS.Synthetics();

exports.handler = async (event: any) => {
  console.log(`starting canary ${JSON.stringify(event)}`);
  const startResult = await synthteticsClient.startCanary({
    Name: event.canaryName,
  }).promise();
  console.log(`canary ${event.canaryName} started`);
  return startResult.$response.data;
};
