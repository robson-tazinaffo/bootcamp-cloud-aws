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
Name: dio-live
```
```
$ cd dio-live
$ code .
```
- No arquivo ```serverless.yml``` adicionar a região ```region: us-east-1``` dentro do escopo de ```provider:```
- Salvar e realizar o deploy ```$ serverless deploy -v```

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
          TableName: ItemTable
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
                - arn:aws:dynamodb:us-east-1:167880115321:table/ItemTable
  ```

   - Instalar dependências

   ```npm init```
   ```npm i uuid aws-sdk```

  - Atualizar lista de funções no arquivo serverless.yml
  ```
  functions:
  hello:
    handler: src/hello.handler
    events:
      - http:
          path: /
          method: get
  insertItem:
    handler: src/insertItem.handler
    events:
      - http:
          path: /item
          method: post
  fetchItems:
    handler: src/fetchItems.handler
    events:
      - http:
          path: /items
          method: get
  fetchItem:
    handler: src/fetchItem.handler
    events:
      - http:
          path: /items/{id}
          method: get
  updateItem:
    handler: src/updateItem.handler
    events:
      - http:
          path: /items/{id}
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
```



- updateProduct.js



```
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
```



- fetchProducts.js

```
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
```



- fetchProduct.js

```
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
```



Fazer o deploy novamente:

```$ serverless deploy -v ```
