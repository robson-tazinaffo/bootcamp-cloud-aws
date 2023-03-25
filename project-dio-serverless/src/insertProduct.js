'use strict'

const { v4 } = require('uuid')
const AWS = require('aws-sdk')

const insertProduct = async event => {
    const { description, status, price } = JSON.parse(event.body)
    const createDate = new Date().toISOString()
    const id = v4()

    var responseBody = ''
    var statusCode = 0

    const dynamodb = new AWS.DynamoDB.DocumentClient()

    const newProduct = {
        id,
        description,
        createDate,
        status,
        price
    }

    try {
        await dynamodb
            .put({
                TableName: 'products',
                Item: newProduct
            })
            .promise()

        responseBody = JSON.stringify(newProduct)
        statusCode = 200
    } catch (e) {
        responseBody = JSON.stringify(e)
        statusCode = 400
    }

    const response = {
        statusCode: statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: responseBody
    }

    return response
}

module.exports = {
    handler: insertProduct
}
