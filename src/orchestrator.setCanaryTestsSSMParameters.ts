import * as AWS from 'aws-sdk';
const ssmClient = new AWS.SSM();


exports.handler = async (event: any) => {
  if (event.inputVariables) {
    console.log(`storing canary input parameters: ${JSON.stringify(event)}`);
    for (const inputVar of event.inputVariables) {
      await ssmClient.putParameter({
        Name: inputVar.name,
        Value: inputVar.value,
        Type: 'String',
        Overwrite: true,
      }).promise();
    }
  } else {
    console.log('No input provided. skipping.');
  }
  return;
};
