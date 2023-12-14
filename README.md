# lambda-pedido-acolhimento

## Baseline DB

`DATABASE_URL` deve apontar para o ambiente desejado.

```
	npx prisma db pull
```

Checar mudanças no arquivo `schema.prisma`, idealmente nenhuma mudança nas tabelas do schema `match` foram feitas e você poderá salvar como está.

No entanto, caso algum tipo dos nossos modelos tenha mudado, volte para como estava e mantenha assim.

Após as mudanças forem salvas, mude a sua variável de ambiente `DATABASE_URL` para o ambiente local.

```
npx prisma migrate reset
```

```
npm run migrate:dev -- --name baseline-with-django-changes-01
```

O número final deve ser incremental, então cheque qual foi o último com o prefixo "basline-with-django-changes-" na pasta `prisma/migrations` e some mais 1.

Commite suas mudanças. Após isso, mude sua variável `DATABASE_URL` para o ambiente em que você deu o `db pull`, e execute:

```
npx prisma migrate resolve --applied [nome da migration criada]
```

Não esqueça de voltar sua variável de ambiente `DATABASE_URL` para o banco local.