# API Node.js com Serverless Framework em ambiente AWS

Neste projeto vamos criar uma infraestrutra em nuvem AWS com API Gateway, DynamoDB, AWS Lambda e AWS CloudFormation utilizando o framework Serverless para o desenvolvimento baseada em IAC (Infraestrutura as a Code.)

## Pré requisitos

 - possuir uma conta na AWS.

​		[Crie uma conta na AWS se não tiver uma](https://aws.amazon.com/pt/free/)

 - Ter o NodeJs e o Postman instalados na máquina

​		[Download do Postman](https://www.postman.com/downloads/)

​		[Download do Nodejs](https://nodejs.org/en/download)

 - Instalar o AWS CLI: 

   https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html

   

- Possuir um editor de código instalado para manipular os arquivos de configuração e instalação, no caso recomendo o VSCode da microsoft.

  ​	[Download VSCode](https://code.visualstudio.com/download)



### Configurações iniciais



#### Credenciais AWS

- Criar usuário: AWS Management Console -> IAM Dashboard -> Create New User -> <nome do usuário> -> Permissions "Administrator Access" -> Programmatic Access -> Dowload Keys

- No terminal: ```$ aws configure``` -> colar as credenciais geradas anteriormente

  
#### Configurar o framework Serverless
```$ npm i -g serverless```

### Desenvolvimento do projeto

```
$ serverless
Login/Register: No
Update: No
Type: Node.js REST API
Name: app-cognito-dio
```
```
$ cd app-cognito-dio
$ code .
```
- No arquivo ```serverless.yml``` adicionar a região ```region: us-east-1``` dentro do escopo de ```provider:```
- Salvar e realizar o deploy ```$ serverless deploy```

#### Estruturar o código

- Criar o diretório "src" e mover o arquivo "handler.js" para dentro dele
- Renomear o arquivo "handler.js" para "hello.js"
- Atualizar o código 
```
const hello = async (event) => {
/////
module.exports = {
    handler:hello
}
```
- Atualizar o arquivo "serverless.yml "
```
handler: src/hello.handler
```
```$ serverless deploy -v ```

#### DynamoDB
Atualizar o arquivo serverless.yml
```
resources:
  Resources:
    ItemTable:
      Type: AWS::DynamoDB::Table
      Properties:
          TableName: products
          BillingMode: PAY_PER_REQUEST
          AttributeDefinitions:
            - AttributeName: id
              AttributeType: S
          KeySchema:
            - AttributeName: id
              KeyType: HASH
```


#### Desenvolver funções lambda

	- Pasta /src do repositório
	- Obter arn da tabela no DynamoDB AWS Console -> DynamoDB -> Overview -> Amazon Resource Name (ARN)
	- Atualizar arquivo serverless.yml com o código a seguir, abaixo do ```region:```
  ```
	iam:
      role:
          statements:
            - Effect: Allow
              Action:
                - dynamodb:PutItem
                - dynamodb:UpdateItem
                - dynamodb:GetItem
                - dynamodb:Scan
              Resource:
                - arn:aws:dynamodb:us-east-1:1234567891011:table/products
  ```

   - Instalar dependências

   ```npm init```
   ```npm i uuid aws-sdk```

  - Atualizar lista de funções no arquivo serverless.yml
  ```
  functions:
    hello:
      handler: src/handler.hello
      events:
        - http:
            path: /
            method: get
    insertProduct:
      handler: src/insertProduct.handler
      events:
        - http:
            path: /product
            method: post
    fetchProducts:
      handler: src/fetchProducts.handler
      events:
        - http:
            path: /products
            method: get
    fetchProduct:
      handler: src/fetchProduct.handler
      events:
        - http:
            path: /product/{id}
            method: get
    updateProduct:
      handler: src/updateProduct.handler
      events:
        - http:
            path: /product/{id}
            method: put
  ```



### Funções: 

- hello.js

```
"use strict";

const hello = async (event) => {
//module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v2.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};


module.exports = {
    handler:hello
}


```



- insertProduct.js

```
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB.DocumentClient()

const insertProduct = async (event) => {

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

module.exports = {
    handler:insertProduct
}

```



- updateProduct.js



```
var AWS = require('aws-sdk')
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

```



- fetchProducts.js

```
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
    } catch (error) {
        statusCode = 502
        responseBody = JSON.stringify(description)
        console.log(error)
    }

    const response = {
        statusCode: statusCode,
        body: responseBody
    }

    return response
}

module.exports = {
    handler: fetchProducts;
}

```



- fetchProduct.js

```
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
```



Fazer o deploy novamente:

```$ serverless deploy ```
