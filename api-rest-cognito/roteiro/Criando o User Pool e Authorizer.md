# Configurando o Amazon Cognito => User Pool



##### Siga os passos abaixo:

- Acesse o Cognito pela barra de pesquisa ou Marketplace.
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

