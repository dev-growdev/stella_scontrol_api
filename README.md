<h1 align="center" style="font-weight: bold;">Stella API</h1>

<p align="center">
 <a href="#started">Getting Started</a> •
  <a href="#routes">API Endpoints</a> •
 <a href="#patterns">Patterns</a> •
</p>

<p align="center">
  <b>Stella Back-end Application</b>
</p>

<h2 id="started">🚀 Getting started</h2>

<h3>Prerequisites</h3>

- [NodeJS](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (Optional for run database and app in containers)

<h3>Cloning</h3>

How to clone your project

```bash
git clone https://github.com/dev-growdev/stella_scontrol_api.git
```

---

<h3> Environment Variables</h2>

Use the `.env-example` as reference to create your configuration file `.env`.

---

<h3>Starting</h3>

How to install and start your project

```bash
npm install && npm run start:dev
``````

---

<h3>Using Docker</h3>

To use Docker you will need the Docker Engine (Linux) or Docker Desktop (Win and MacOs) installed on your machine.

The project uses [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) VSCode Extension to build and run the app inside a Docker container.

---

<h2 id="routes">📍 API Endpoints</h2>

The API endpoints documentation could be found after running the project and accessing <http://localhost:8080/api/docs>.

---

<h3 id="patterns"> 💾 Commit Patterns</h3>

[Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)

---

<h3> 📝 Project Patterns</h3>

##### Class name: PascalCase Pattern

- Example: CreateUser

---

##### Entity name: PascalCase Pattern and always in singular

- Example: UserEntity

---

##### File name: kebab-case Pattern

- Example: new-feature.service.ts

---

##### Class methods name: camelCase Pattern

- Example: getUserByUid

---

##### variable name: camelCase Pattern

- Example: const dataProfile

---

##### Folder/Features name: kebab-case Pattern and always in plural

- Example: users ou generic-**features**

- Service: A single file containing all feature methods
- Controller: A single file containing all feature methods

---

<h3> Structure</h3>

```tree
.
├── docker-compose.yml
├── Dockerfile.dev
├── jest.config.js
├── jest.setup.js
├── nest-cli.json
├── package.json
├── prisma
│   ├── migrations
│   │   ├── 20211004183200-init
│   │   └── migration_lock.toml
│   ├── schema.prisma
│   └── seeds
│       └── seed.ts
├── README.md
├── requests
│   ├── s-auth
│   │   └── login.http
│   └── s-integration
│       └── products
│           ├── create.http
│           ├── disable.http
│           ├── findAll.http
│           └── update.http
├── src
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.providers.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── modules
│   │   ├── @facades
│   │   │   ├── facades.module.ts
│   │   │   └── s-integration
│   │   │       ├── cesar.facade.ts
│   │   │       ├── receitaws.facade.ts
│   │   │       └── sieger.facade.ts
│   │   ├── s-auth
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.spec.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.service.spec.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── dtos
│   │   │   │   │   ├── auth-input.dto.ts
│   │   │   │   │   └── auth-output.dto.ts
│   │   │   │   └── strategy
│   │   │   │       ├── index.ts
│   │   │   │       └── jwt.strategy.ts
│   │   │   └── s-auth.module.ts
│   │   └── s-integration
│   │       ├── cesar
│   │       │   ├── cesar.module.ts
│   │       │   ├── cesar.service.ts
│   │       │   ├── dto
│   │       │   │   └── receitaws-output.dto.ts
│   │       │   └── knexconfig.ts
│   │       └── s-integration.module.ts
│   └── shared
│       ├── decorators
│       │   └── user.decorator.ts
│       ├── docs
│       │   └── adrs
│       ├── exceptions
│       │   ├── custom.exception.ts
│       │   └── index.ts
│       ├── guards
│       │   ├── auth.guard.ts
│       │   └── index.ts
│       ├── modules
│       │   ├── email
│       │   └── prisma
│       ├── pipes
│       │   └── validation.pipe.ts
│       ├── response
│       │   ├── custom-response.interceptor.ts
│       │   └── index.ts
│       ├── services
│       │   ├── bcrypt.service.ts
│       │   └── index.ts
│       └── utils
│           ├── index.ts
│           └── remove-special-characters.decorator.ts
├── test
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── setup
│       ├── client.ts
│       └── truncate-database.ts
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

---

### CI/CD

When opening a PR for the develop branch, a github action is triggered that runs the tests.
