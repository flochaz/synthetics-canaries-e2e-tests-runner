import * as AWS from 'aws-sdk';
const synthteticsClient = new AWS.Synthetics();


exports.handler = async (event: any) => {
  console.log(`starting canary with event: ${JSON.stringify(event)}`);
  await synthteticsClient.startCanary({
    Name: event.canaryName,
  }).promise();
  console.log(`canary ${event.canaryName} started`);
  return;
};

