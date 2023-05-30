'use strict'
const AWS = require('aws-sdk')

const fetchProducts = async event => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()

    let description
    let responseBody = ''
    let statusCode = 0

    try {
        const results = await dynamodb
            .scan({
                TableName: 'products'
            })
            .promise()

        description = results.Items
        statusCode = 200
        responseBody: JSON.stringify(description)
    } catch (error) {
        statusCode = 502
        responseBody = JSON.stringify(error)
        console.log(error)
    }

    const response = {
        statusCode: statusCode,
        body: responseBody
    }

    return response
}

module.exports = {
    handler: fetchProducts
}
