## POC-API-NESTJS

---

### O que é o NestJS?

De acordo com a própria documentação:

    NestJS é um framework progressivo NodeJS para construir aplicações eficientes, confiáveis e escaláveis no lado do servidor. (Tradução-livre)

Em outras palavras: É um framework back-end para NodeJS.

O NestJS utiliza e combina elementos de diversos paradigmas de programação: Orientação à Objetos (classes, interfaces, etc), programação funcional (funções e escopos próprios) e o paradigma funcional reativo.

Por "baixo dos panos" o NestJs utiliza o ExpressJs (por padrão) como framework para criação de servidor HTTP. (Sendo possível configurar e utilizar o fastify também).

### Por que usar NestJS?

- Open-Source
- Uso do Typescript
- Possui uma CLI poderosa que permite maior produtividade no desenvolvimento
- Arquitetura/Organização de código de fácil entendimento: um Padrão MVC (Model-View-Controller) melhorado.
- Injeção de Dependência
- Modularização: Separação das responsabilidades por módulos.
- Escalável
- Excelente documentação
- Menor curva de aprendizado

---

### Tecnologias utilizadas

##### ORM/Database

 - Prisma
 - PostgreSQL
 - Redis

##### Routing

 - Express

##### Data Validation

 - Class Transformer/Class Validator

##### Hashing/encrypt

 - Bcrypt

##### E-mail Handler

 - NodeMailer

##### Views Engine

 - HandleBars 

##### Tests

 - Jest

 ##### Containers

  - Docker

### Padronizações de nomenclaturas do projeto

##### Nome de classes: Padrão PascalCase
- Exemplo: CreateUser

---

##### Nome de entidade: Padrão PascalCase e sempre no singular
- Exemplo: UserEntity

---

##### Nome de arquivo: Padrão kebab-case
- Exemplo: create-user.repository.ts

----

##### Nome de métodos de classes: Padrão camelCase
- Exemplo: getUserByUid

----

##### Nome de variáveis: Padrão camelCase
- Exemplo: const dataProfile

----

- Controller: Um único arquivo contendo todos os métodos da feature
- Service: Um único arquivo contendo todos os métodos da feature

---
