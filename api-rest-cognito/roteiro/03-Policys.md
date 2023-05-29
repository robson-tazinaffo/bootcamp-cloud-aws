# API Node.js com Serverless Framework em ambiente AWS



#### Passo 1 - Criar tabela no DynamoDB

- Selecionar o serviço DynamoDB.
- Create Table
- em Create Table -> Table name, informar o nome da tabela (product)
- Em Partition Key inserir o partition key name (id)
- Em Table settings, selecionar Default settings
- Ir ao final e clicar em Create table.



- Depois da tabela criada, selecionar a tabela e clicar.
- Na tela que será apresentada, ir em Additional info e copiar a chave (ARN), precisaremos dela para gerar as configurações e a API serverless.



#### Passo 2 - Criar as politicas de permissão para as funcões Lambda.

- Selecionar o serviço Lambda->Functions-><função desejada>.
- Selecione a aba Configuration logo abaixo.
- Selecione a opção Permissions no menu esquerdo.
- Selecione a Role Name.
