const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

exports.handler = async event => {
    let responseBody = ''
    let statusCode = 0

    let { id, description, price } = JSON.parse(event.body)

    const params = {
        TableName: 'products',
        Item: {
            id: id,
            description: description,
            price: price
        }
    }

    try {
        await dynamodb.put(params).promise()
        statusCode = 200
        responseBody = JSON.stringify('Produto inserido com sucesso!')
    } catch (err) {
        statusCode = 502
        responseBody = JSON.stringify(err)
        console.log(err)
    }

    const response = {
        statusCode: statusCode,
        body: responseBody
    }

    return response
}
