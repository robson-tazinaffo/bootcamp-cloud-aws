'use strict'

const AWS = require('aws-sdk')

const updateProduct = async event => {
    const { status } = JSON.parse(event.body)
    const { id } = event.pathParameters

    const dynamodb = new AWS.DynamoDB.DocumentClient()

    await dynamodb
        .update({
            TableName: 'products',
            Key: { id },
            UpdateExpression: 'set status = :status',
            ExpressionAttributeValues: {
                ':status': status
            },
            ReturnValues: 'ALL_NEW'
        })
        .promise()

    return {
        statusCode: 200,
        body: JSON.stringify({ msg: 'Produto atualizado!' })
    }
}

module.exports = {
    handler: updateProduct
}
