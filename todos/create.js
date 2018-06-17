'use strict'

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {

    const timestamp = new Date().getTime();
    // Text provided in a request
    const data = JSON.parse(event.body);

    // VALIDATE: Text is a string
    if(typeof data.text !== 'string'){
        console.error('Validation Failed.');
        callback(new Error('Could not create todo item.'));
        return;
    }

    // Parameter schema 
    const params = {
        TableName: 'todos',
        Item: {
            id: uuid.v1(),
            text: data.text,
            checked: false,
            createdAt: timestamp,
            updatedAt: timestamp
        }
    }

    dynamoDB.put(params, (err, res) => {
        if(err){
            console.error(err);
            callback(new Error('Could not create todo item.'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(res.Item)
        }
        callback(null, res);
    });
}