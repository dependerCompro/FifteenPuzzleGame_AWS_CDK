const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async(event, context, callback) => {
    await updateStatistics(event, context).then(() => {
        callback(null, {
            statusCode: 201,
            body: "",
            headers: {
                'Access-Control-Allow-Origin': "*"
            }
        })
    }).catch((err) => {
        console.error(err)
    });
};

function updateStatistics(event, context){
    const timestamp = new Date().toJSON();
    const data = JSON.parse(event.body)
    const params = {
        TableName: 'statistics',
        Item: {
            'id': context.awsRequestId,
            'timestamp': timestamp,
            'minutes': data.minutes,
            'seconds': data.seconds,
            'moves': data.moves
        }
    }
    return ddb.put(params).promise();
}