var AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

exports.handler = async event => {
    let responseBody = ''
    let statusCode = 0

    let { product_status } = JSON.parse(event.body)
    let { price } = JSON.parse(event.body)
    const { id } = event.pathParameters

    try {
        await dynamodb
            .update({
                TableName: 'products',
                Key: { id },
                UpdateExpression:
                    'set product_status = :product_status, price = :price',
                ExpressionAttributeValues: {
                    ':product_status': product_status,
                    ':price': price
                },
                ReturnValues: 'ALL_NEW'
            })
            .promise()
        statusCode = 200
        responseBody = JSON.stringify('Produto atualizado com sucesso!')
    } catch (err) {
        statusCode = 200
        responseBody = JSON.stringify(err)
    }

    const response = {
        statusCode: statusCode,
        body: responseBody
    }

    return response
}
