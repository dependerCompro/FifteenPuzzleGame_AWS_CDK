const AWS = require('aws-sdk')
const ddb = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

exports.handler = async(event, context, callback) => { 
    await readStatistics().then(data => {
        data.Items.forEach(function(item) {
            console.log("Request Served");
        })
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(data.Items),
            headers: {
                'Access-Control-Allow-Headers': "Content-Type",
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Methods': "GET"
            }
        })
    }).catch((err) => {
        console.error(err);
    });
};

function readStatistics(){
    const params = {
        TableName: 'laststate',
    }
    return ddb.scan(params).promise();
}