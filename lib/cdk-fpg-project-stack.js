const { Stack, Duration, CfnOutput } = require('aws-cdk-lib');
const { RestApi, LambdaIntegration, LogGroupLogDestination, Cors} = require('aws-cdk-lib/aws-apigateway');
const { PolicyStatement, Effect, Role, ServicePrincipal } = require('aws-cdk-lib/aws-iam')
const lambda = require('aws-cdk-lib/aws-lambda');
const dynamodb = require('aws-cdk-lib/aws-dynamodb')
const cloudwatch = require('aws-cdk-lib/aws-logs')
const aws_apigatewayv2 = require('aws-cdk-lib/aws-apigatewayv2');
const s3 = require('aws-cdk-lib/aws-s3');
const s3deploy = require('aws-cdk-lib/aws-s3-deployment');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const origins = require('aws-cdk-lib/aws-cloudfront-origins');
const npm = require('npm-commands')

class CdkFpgProjectStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    //////  -------  Backend  ---------  ///////

    // Creating WebSocket
    const WebSocketApi = new aws_apigatewayv2.CfnApi(this, 'cdk-WebSocketApi', {
      name: "cdk-WebSocketApi",
      protocolType: "WEBSOCKET",
      routeSelectionExpression: "$request.body.action"
    })

    // WebSocket updateLastState Lambda
    const lambdaUpdateLastState = new lambda.Function(this, "cdk-updateLastState", {
      functionName: "cdk-updateLastState",
      code: lambda.Code.fromAsset("functions/samFuncUpdateLastState"),
      handler: "samFuncUpdateLastState.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      timeout: Duration.seconds(300),
      memorySize: 256,
      initialPolicy: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          // to send messages to apiGateway-role
          actions: ["execute-api:ManageConnections"],
          resources: ["*"]
        })
      ]
    });

    // Role for API GateWay to invoke lambda
    const role = new Role(this, "cdk-RoleForAPIGatewayInvokeLambda", {
      roleName: "cdk-RoleForAPIGatewayInvokeLambda",
      assumedBy: new ServicePrincipal("apigateway.amazonaws.com")
    });

    role.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["lambda:InvokeFunction"],
        resources: [
          lambdaUpdateLastState.functionArn
        ]
      })
    )

    // Creating Web Socket Update LastState Integration
    const wsUpdateLastStateIntegration = new aws_apigatewayv2.CfnIntegration(
      this,
      "cdk-wsUpdateLastStateIntegration",
      {
        apiId: WebSocketApi.ref,
        integrationType: "AWS",
        integrationUri: `arn:aws:apigateway:${this.region}:lambda:path/2015-03-31/functions/${lambdaUpdateLastState.functionArn}/invocations`,
        credentialsArn: role.roleArn
      }
    )

    // UpdateLastState Route
    const updateLastStateRoute = new aws_apigatewayv2.CfnRoute(this, 'cdk-wsUpdateLastStateRoute', {
      apiId: WebSocketApi.ref,
      routeKey: "updateLastState",
      authorizationType: "NONE",
      target: "integrations/" + wsUpdateLastStateIntegration.ref,
    })

    // Creating Web Socket Deployment
    const wsDeployment = new aws_apigatewayv2.CfnDeployment(this, "cdk-wsDeployment",{
      apiId: WebSocketApi.ref
    });

    new aws_apigatewayv2.CfnStage(this, 'wsDevStage',{
      stageName: "dev",
      deploymentId: wsDeployment.ref,
      apiId: WebSocketApi.ref,
      autoDeploy: true
    })

    wsDeployment.node.addDependency(updateLastStateRoute);

    // Output - so that we get endpoints without logging into AWS Console.
    new CfnOutput(this, "wssEndpoint", {
      exportName: "wssEndpoint",
      value: `wss://${WebSocketApi.ref}.execute-api.${this.region}.amazonaws.com/dev`
    });

    // Creating a log group for apiGateway logs
    const logs_apiGateway = new cloudwatch.LogGroup(this, "cdk-apiGatewayogs")

    // Creating apiGateway
    const apigateway = new RestApi(this, "cdk-api-gateway", {
      deployOptions: {
        accessLogDestination: new LogGroupLogDestination(logs_apiGateway)
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS
      }
    });

    // Lambdas for statistics resource with GET method
    const lambdaGetStatistics = new lambda.Function(this, "cdk-getStatistics", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'samFuncGetStatistics.handler',
      code: lambda.Code.fromAsset("functions/samFuncGetStatistics")
    });

    // Lambdas for statistics resource with POST method
    const lambdaUpdateStatistics = new lambda.Function(this, "cdk-updateStatistics", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'samFuncUpdateStatistics.handler',
      code: lambda.Code.fromAsset("functions/samFuncUpdateStatistics")
    });

    // Assigning lambdas to api methods.
    const statisticsResource = apigateway.root.addResource('statistics')
    statisticsResource.addMethod("GET", new LambdaIntegration(lambdaGetStatistics, {
      allowTestInvoke: false
    }))
    statisticsResource.addMethod("POST", new LambdaIntegration(lambdaUpdateStatistics, {
      allowTestInvoke: false
    }))

    // Lambdas for laststate Resource with GET method
    const lambdaGetLastState = new lambda.Function(this, "cdk-getLastState", {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'samFuncGetLastState.handler',
      code: lambda.Code.fromAsset("functions/samFuncGetLastState")
    });

    // Assigning lambda to api method.
    apigateway.root
    .addResource('laststate')
    .addMethod("GET", new LambdaIntegration(lambdaGetLastState, {
      allowTestInvoke: false
    }))

    //Creating instances for DynamoDB Tables
    const statistics_table = dynamodb.Table.fromTableArn(this, 'statistics', 'arn:aws:dynamodb:us-east-1:279392984442:table/statistics')
    const laststate_table = dynamodb.Table.fromTableArn(this, 'laststate', 'arn:aws:dynamodb:us-east-1:279392984442:table/laststate')
    
    // Assigning read/write permissions to lambdas
    statistics_table.grantReadData(lambdaGetStatistics)
    statistics_table.grantReadWriteData(lambdaUpdateStatistics)
    laststate_table.grantReadData(lambdaGetLastState)
    laststate_table.grantReadWriteData(lambdaUpdateLastState)

    //////  -------  Code to build Vue project  ---------  ///////
    npm().cwd('frontend').install();
    npm().cwd('frontend').run('build');

    //////  -------  Frontend  ---------  ///////

    // Creating S3 Bucket for Frontend
    const fpgBucket = new s3.Bucket(this, 'cdk-fpg-Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
    });
    
    // Creating Cloudfront distribution for above bucket
    const fpgDistribution = new cloudfront.Distribution(this, 'cdk-fpg-distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(fpgBucket)
      },
      defaultRootObject: 'index.html'
    });
    
    // Deploying Frontend to S3 Bucket
    const fpgDeploy = new s3deploy.BucketDeployment(this, 'cdk-fpg-deployment', {
      sources: [ s3deploy.Source.asset('frontend/dist') ],
      destinationBucket: fpgBucket,
      distribution: fpgDistribution,
      distributionPaths: ['/*']
    });
  }
}

module.exports = { CdkFpgProjectStack }
