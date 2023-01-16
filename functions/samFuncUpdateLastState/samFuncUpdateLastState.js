const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async(event, context, callback) => {
    await updateLastState(event).then(() => {
        callback(null, {
            statusCode: 201,
            body: "",
            headers: {
                'Access-Control-Allow-Headers': "Content-Type",
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Methods': "POST"
            }
        })
    }).catch((err) => {
        console.error(err)
    });
};

function updateLastState(event){
    const params = {
        TableName: 'laststate',
        Item: {
            'id': event.data.id,
            'emptyX':event.data.emptyX,
            'emptyY':event.data.emptyY,
            'minutes': event.data.minutes,
            'seconds': event.data.seconds,
            'moves': event.data.moves,
            'values': event.data.values
        }
    }
    return ddb.put(params).promise();
}