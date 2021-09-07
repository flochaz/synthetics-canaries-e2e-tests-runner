import * as synthetics from '@aws-cdk/aws-synthetics';
import * as cdk from '@aws-cdk/core';


export class E2ETestsCanaries extends cdk.Construct {
  public readonly canaries: synthetics.Canary[] = [];
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const testAPI = new synthetics.Canary(this, 'Pass API Test', {
      canaryName: 'pass-test',
      schedule: synthetics.Schedule.once(),
      test: synthetics.Test.custom({
        code: this.generateAPICallTestToMockedAPI(true),
        handler: 'index.handler',
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
    });

    this.canaries.push(testAPI);

    this.canaries.push(new synthetics.Canary(this, 'Fail API Test', {
      canaryName: 'fail-test',
      schedule: synthetics.Schedule.once(),
      test: synthetics.Test.custom({
        code: this.generateAPICallTestToMockedAPI(false),
        handler: 'index.handler',
      }),
      runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_1,
    }));

  }

  private generateAPICallTestToMockedAPI(expectSuccess: boolean ): synthetics.Code {
    let userId = '999999999'; // userId generating 404 response on mock API
    if (expectSuccess) {
      userId = '1234567890';
    };

    return synthetics.Code.fromInline(`
        var synthetics = require('Synthetics');
        const AWS = require('aws-sdk');
        const log = require('SyntheticsLogger');
        const https = require('https');
        const http = require('http');

        const ssmClient = new AWS.SSM();
        const apiCanaryBlueprint = async function (event) {
          const postData = "";

          const verifyRequest = async function (requestOption) {
            return new Promise((resolve, reject) => {
              log.info("Making request with options: " + JSON.stringify(requestOption));
              let req
              if (requestOption.port === 443) {
                req = https.request(requestOption);
              } else {
                req = http.request(requestOption);
              }
              req.on('response', (res) => {
                log.info(\`Status Code: \${res.statusCode}\`)
                log.info(\`Response Headers: \${JSON.stringify(res.headers)}\`)
                //If the response status code is not a 2xx success code
                if (res.statusCode < 200 || res.statusCode > 299) {
                  reject("Failed: " + requestOption.path);
                }
                res.on('data', (d) => {
                  log.info("Response: " + d);
                });
                res.on('end', () => {
                  resolve();
                })
              });

              req.on('error', (error) => {
                reject(error);
              });

              if (postData) {
                req.write(postData);
              }
              req.end();
            });
          }

          const headers = {}
          headers['User-Agent'] = [synthetics.getCanaryUserAgentString(), headers['User-Agent']].join(' ');
          const url = await ssmClient.getParameter({Name: 'DemoApiUrl'}).promise();
          const requestOptions = {"hostname":url.Parameter.Value.split('/')[2],"method":"GET","path":"/prod/users/${userId}","port":443}
          log.info(\`requestOptions \${requestOptions}\`);
          requestOptions['headers'] = headers;
          await verifyRequest(requestOptions);
        };

        exports.handler = async (event) => {
          return await apiCanaryBlueprint(event);
        };
        `);
  }
}