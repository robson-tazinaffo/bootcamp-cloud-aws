'use strict'
const AWS = require('aws-sdk')

const fetchProducts = async event => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()

    let description

    try {
        const results = await dynamodb
            .scan({
                TableName: 'products'
            })
            .promise()

        description = results.Items
    } catch (error) {
        console.log(error)
    }

    return {
        statusCode: 200,
        body: JSON.stringify(description)
    }
}

module.exports = {
    handler: fetchProducts
}
