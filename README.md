# lambda-pedido-acolhimento

AWS Lambda com API Gateways que fazem tudo relacionado ao processamento do pedido de acolhimento da MSR.

## Introdução

Esse projeto se propõe a especializar o modo como uma mulher em situação de risco recebe um match. Ele introduz o match por etapas (ideal, expandido e online), atende aos requisitos da pesquisa da Busara e introduz o match reverso.

Utilizamos [Serverless](https://www.serverless.com) para orquestrar a publicação das AWS Lambdas, que por sua vez têm sua lógica interna exposta a endpoints via Api Gateway da AWS.

## Como Começar

### Requisitos

- Node v18 (LTS atual)
	- Utilize o [nvm](https://github.com/nvm-sh/nvm) para gerenciar suas versões de node, facilitando migrações ou possíveis downgrades
- Variáveis de ambiente
	- Todas as vars necessárias para rodar o projeto estão no .env.example

```bash
# Instale as dependências
npm install

# gere os artefatos do Prisma Client
npm run generate

# Execute o servidor local
npm run dev
```

Não se esqueça de rodar o banco local a partir do repositório [`mapa-migrations`](https://github.com/mapadoacolhimento/mapa-migrations).

Caso queira saber mais sobre porque geramos os artefatos do Prisma Client, [clique aqui](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client).

**⚠️ AVISO**: Nunca altere o arquivo `schema.prisma` nesse repositório. Todas as migrations que realizamos em nosso banco de dados são feitas no [`mapa-migrations`](https://github.com/mapadoacolhimento/mapa-migrations). Esse arquivo será [automaticamente atualizado](https://github.com/mapadoacolhimento/mapa-migrations/blob/main/.github/workflows/update-schema.yml) aqui quando o `schema.prisma` do repositório `mapa-migrations` for atualizado.


## Endpoints

### Auth

Autentica as rotas privadas.

```http
POST /auth
```

### Compose

Cria o(s) support request(s) e, caso a feature flag do `NEW_MATCH` esteja habilitada, cria um novo match(es).

```http
POST /compose
```

### FeatureFlag

Verifique se uma feature flag com aquele nome está habilitada.

```http
GET /featureFlag?name=FEATURE_FLAG_NAME
```

### Sign

Cria um token de autenticação.

```http
POST /sign
```