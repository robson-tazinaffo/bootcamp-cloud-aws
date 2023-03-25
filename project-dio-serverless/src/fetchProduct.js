'use strict'
const AWS = require('aws-sdk')

const fetchProduct = async event => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()

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
    } catch (error) {
        console.log(error)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(description)
    }
}

module.exports = {
    handler: fetchProduct
}
