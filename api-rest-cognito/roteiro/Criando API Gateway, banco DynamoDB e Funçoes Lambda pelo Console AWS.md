# Confiuração do Projeto no Console AWS



## Serviços AWS utilizados



![](images\Estrutura.png)

- Amazon Cognito

- Amazon DynamoDB

- Amazon API Gateway

- AWS Lambda

  

## Etapas do desenvolvimento



### Criando uma API REST no Amazon API Gateway

- API Gateway Dashboard -> Create API -> REST API -> Build
- Protocol - REST -> Create new API -> API name [dio_live_api] -> Endpoint Type - Regional -> Create API
- Resources -> Actions -> Create Resource -> Resource Name [Items] -> Create Resource



### Criando uma tabela no banco de dados Amazon DynamoDB

- DynamoDB Dashboard -> Tables -> Create table -> Table name [Items] -> Partition key [id] -> Create table





### No AWS Lambda



#### Função para inserir item

- Lambda Dashboard -> Create function -> Name [insertProducts] -> Create function

- Inserir código da função ```insertProducts.js``` disponível na pasta ```/src``` -> Deploy

- Configuration -> Execution role -> Abrir a Role no console do IAM

- IAM -> Roles -> Role criada no passo anterior -> Permissions -> Add inline policy

- Service - DynamoDB -> Manual actions -> add actions -> putItem

- Resources -> Add arn -> Selecionar o arn da tabela criada no DynamoDB -> Add

- Review policy -> Name [lambda_dynamodb_putItem_policy] -> Create policy

  

### Integrando o API Gateway com o Lambda backend

- API Gateway Dashboard -> Selecionar a API criada -> Resources -> Selecionar o resource criado -> Action -> Create method - POST

- Integration type -> Lambda function -> Use Lambda Proxy Integration -> Lambda function -> Selecionar a função Lambda criada -> Save

- Actions -> Deploy API -> Deployment Stage -> New Stage [dev] -> Deploy

  

### No POSTMAN

- Add Request -> Method POST -> Copiar o endpoint gerado no API Gateway
- Body -> Raw -> JSON -> Adicionar o seguinte body
```
{
  "id": "001",
  "description": "Pruduto Teste 01",
  "price": 100
}
```
- Send



### No Amazon Cognito - Criando User Pool

##### Siga os passos abaixo:

- Acesse o Amazon Cognito pela barra de pesquisa ou Marketplace.
- Clique no botão "criar grupo de usuários".
- Na nova página, dentro da seção "Provedores de autenticação" e abaixo do sub-título "Tipos de provedor" selecione "Grupo de usuários do Cognito"
- Marque o checkbox "e-mail" nas opções de login do grupo de usuários Cognito
- Clique no botão "Próximo"
- Na mesma página, dentro da seção "Autenticação multifator" e abaixo do sub-título "Imposição de MFA" selecione "Sem MFA" caso queira seguir o padrão que escolhi pessoalmente ou a opção com MFA que atenda seu cenário local.
- Clique no botão "Próximo".
- Na próxima página mantenha as configurações padrão e clique no botão "Próximo"
- Na nova página, dentro da seção "E-mail" e abaixo do sub-título "Provedor de e-mail" selecione "Enviar e-mails com Cognito".
- Clique no botão "Próximo".
- Na nova página, dentro da seção "Políticas de senha" e abaixo do sub-título "Modo de política de senha" selecione "Padrões do Cognito".
- Na nova página com título "Integrar sua aplicação", dentro da seção "Nome do grupo de usuário" e abaixo do sub-título "Nome do grupo de usuários" preencha o campo de texto segundo orientações da plataforma.
- Na seção "Domínio" e abaixo do sub-título "Tipo de domínio" selecione a opção "Usar um domínio do Cognito" e, logo abaixo, preencha o campo de texto com título "Domínio do Cognito" segundo orientações da plataforma.
- Na seção "Cliente de aplicação inicial" e abaixo do sub-título "Tipo de aplicação" selecione a opção "Cliente público" e preencha os campos de texto com títulos "Nome do cliente de aplicação" e "URL" segundo orientações da plataforma.
- Clique no botão "Próximo".
- Revise todos os dados do Grupo criado e caso tudo esteja de acordo com o desejado clique no botão "Criar grupo de usuários"



### Criando um autorizador do Amazon Cognito para uma API REST no Amazon API Gateway

- API Gateway Dashboard -> Selecionar a API criada -> Authorizers -> Create New Authorizer
- Name [CognitoAuth] -> Type - Cognito -> Cognito User Pool [pool criada anteriormente] -> Token Source [Authorization]
- Resources -> selecionar o resource criado -> selecionar o método criado -> Method Request -> Authorization - Selecionar o autorizador criado



### No Postman

- Add request -> Authorization
- Type - OAuth 2.0
- Callback URL [https://example.com/logout]
- **Auth URL**: https://xxx.auth.us-east-1.amazoncognito.com/oauth2/authorize
- ##### Access Token URL: https://xxx.auth.us-east-1.amazoncognito.com/oauth2/token

- Client ID - obter o Client ID do Cognito em App clients
- Scope [email - openid]
- Client Authentication [Send client credentials in body]
- Get New Access Token
- Copiar o token gerado

- Selecionar a request para inserir item criada -> Authorization -> Type - Bearer Token -> Inserir o token copiado
- Send



Segui a documentação abaixo e acrescentei apenas :

/oauth2/authorize  e /oauth2/token no final  das URL's

Onde xxx é sua url



Segue link da documentação que utilizei como base logo abaixo:

https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-userpools-server-contract-reference.html



