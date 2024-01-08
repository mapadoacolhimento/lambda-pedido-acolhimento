# lambda-pedido-acolhimento

AWS Lambda com API Gateways que fazem tudo relacionado ao processamento do pedido de acolhimento da MSR. 

## Introdução

Esse projeto se propõe a especializar o modo como uma mulher em situação de risco recebe um match. Ele introduz o match por etapas (ideal, expandido e online), atende aos requisitos da pesquisa da Busara e introduz o match reverso.

Utilizamos [Serverless](https://www.serverless.com) para orquestrar a publicação das AWS Lambdas, que por sua vez têm sua lógica interna exposta a endpoints via Api Gateway da AWS.

## Como Começar

### Requisitos

- Node v18 (LTS atual)
	- Utilize o [nvm](https://github.com/nvm-sh/nvm) para gerenciar suas versões de node, facilitando migrações ou possíveis downgrades
- [Docker](https://docs.docker.com/engine/install/)
- Variáveis de ambiente 
	- Todas as vars necessárias para rodar o projeto estão no .env.example

```bash
# Instale as dependências
npm install

# Rode o banco de dados local + pgadmin
npm run db:start

# Adc voluntárias "base" para conseguir realizar matches
npm run db:seed
```

### Banco de dados

Após rodar o `db:start` você pode acessar o pgadmin localmente em `localhost:5050`.

Os dados do banco de dados local criado estão dentro do arquivo `docker-compose.yml` na raíz do projeto.

Para referência, esses são os dados que você precisa inserir para acessar o server postgresql gerado:

- Name: `dev-mapa-org` (ou o que você preferir)
- Host name: 
Para encontrar o endereço (IP) que o Docker instanciou o banco, rode:

```bash
docker ps

# copie o CONTAINER_ID da image `postgres`
docker inspect CONTAINER_ID
```

No fim do output, procure por `Network` e então `IPAddress`. Copie esse endereço e cole no campo de hostname, ex: `172.18.0.2`.

- Port: `5432`
- Username: `postgres`
- Password: `changeme`

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

## Prisma e Baseline do Banco de Dados

### Prisma

[Prisma](https://www.prisma.io/) é uma ferramenta de banco de dados ORM (Object-Relational Mapping) que simplifica a interação com o banco de dados. No nosso projeto, utilizamos Prisma para acessar o banco de dados e realizar operações CRUD de maneira eficiente.

### Baseline do Banco de Dados

É importante realizar o baseline do banco de dados periodicamente, especialmente se houver alterações no DB feitas por migrações de outro projeto, como no caso do Cadastro. O baseline é um snapshot do estado atual do banco de dados, garantindo que as alterações feitas por outras migrações não causem conflitos ou problemas de compatibilidade.

Para realizar o baseline usando Prisma, o `DATABASE_URL` deve apontar para o ambiente desejado, depois, execute o seguinte comando:

```bash
npx prisma db pull
```

Cheque as mudanças no arquivo `schema.prisma`, idealmente nenhuma mudança nas tabelas do schema `match` foram feitas e você poderá salvar como está.

No entanto, caso algum tipo dos nossos modelos tenha mudado, volte para como estava e mantenha assim.

Após as mudanças serem salvas, **mude a sua variável de ambiente `DATABASE_URL` para o ambiente local**.

```bash
npx prisma migrate reset
```

_Antes de dar o OK do reset, fique atenta em qual banco de dados o Prisma executará esse comando. Ele sempre deve ser `localhost:5432`, ou onde quer que você rode o seu banco local._

```bash
npm run migrate:dev -- --name [baseline-with-django-changes-01]
```

O número final deve ser incremental, então cheque qual foi o último com o prefixo "basline-with-django-changes-" na pasta `prisma/migrations` e some mais 1.

Commite suas mudanças. Após isso, mude sua variável `DATABASE_URL` para o ambiente em que você deu o `db pull`, e execute:

```bash
npx prisma migrate resolve --applied [nome da migration criada]
```

_Não esqueça de voltar sua variável de ambiente `DATABASE_URL` para o banco local._
