'use strict'
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

const fetchProduct = async event => {
    let responseBody = ''
    let statusCode = 0

    const { id } = event.pathParameters

    let description

    try {
        const result = await dynamodb
            .get({
                TableName: 'products',
                Key: { id }
            })
            .promise()

        description = result.Item
        statusCode = 200
        responseBody = JSON.stringify(description)
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
    handler: fetchProduct
}
