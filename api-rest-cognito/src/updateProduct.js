const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

const updateProduct = async (event) => {

exports.handler = async event => {
    let responseBody = ''
    let statusCode = 0

    let { description } = JSON.parse(event.body)
    let { price } = JSON.parse(event.body)
    const { id } = event.pathParameters

    try {
        await dynamodb
            .update({
                TableName: 'products',
                Key: { id },
                UpdateExpression:
                    'set description = :description, price = :price',
                ExpressionAttributeValues: {
                    ':description': description,
                    ':price': price
                },
                ReturnValues: 'ALL_NEW'
            })
            .promise()
        statusCode = 200
        responseBody = JSON.stringify('Produto atualizado com sucesso!')
    } catch (err) {
        statusCode = 502;
        responseBody = JSON.stringify(err);
        console.log(err)
    }

    const response = {
        statusCode: statusCode,
        body: responseBody
    }

    return response
}

module.exports = {
    handler:updateProduct;
}
