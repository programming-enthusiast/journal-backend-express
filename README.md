# Journal Backend - Express

An [Express](https://expressjs.com) application showcasing best practices. A
great list of these practices can be found [here](https://github.com/goldbergyoni/nodebestpractices).

## Best Practices

### 1. Project Structure Practices

#### [1.1 Structure your solution by components](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md)

The top level directory structure contains modules such as `users`, `journals`,
and `inspirations` instead of technical roles such as `controllers` or `models`.

#### [1.2 Layer your app, keep Express within its boundaries](https://github.com/goldbergyoni/nodebestpractices#-12-layer-your-components-keep-the-web-layer-within-its-boundaries)

The `routers`, for example, deal only with things related to the web layer: requests,
responses, routes themselves. Business logic is located in the `services` modules,
which on their turn use the functionality provided by the infrastructure (including
a database).

For a good reference on layering your app, see Microsoft's [N-tier architecture](https://docs.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier#n-tier-architecture-on-virtual-machines).

#### [1.4 Separate Express 'app' and 'server'](https://github.com/goldbergyoni/nodebestpractices#-14-separate-express-app-and-server)

This allows for the application to be tested with tools such as [`supertest`](https://github.com/visionmedia/supertest#supertest)
and [`nock`](https://github.com/nock/nock#nock).

#### [1.5 Use environment aware, secure and hierarchical config](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/configguide.md#use-environment-aware-secure-and-hierarchical-config)

I'm using a strategy copied from [FreeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp),
using a combination of [`dotenv`](https://github.com/motdotla/dotenv#readme) and
[`joi`](https://github.com/sideway/joi#readme) to build a [validated `config` object](./src/config.ts).

### 2. Error Handling Practices

#### [2.1 Use Async-Await or promises for async error handling](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/asyncerrorhandling.md#use-async-await-or-promises-for-async-error-handling)

I'm using [Typescript](https://www.typescriptlang.org/) so the `async/await` style
of handling errors comes naturally. For an example, See the [journals-router](./src/journals/journals-router.ts).

#### [2.2 Use only the built-in Error object](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/useonlythebuiltinerror.md#use-only-the-built-in-error-object)

The code only throws [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) objects
or instances of [classes that extend it](./src/errors).

#### [2.3 Distinguish operational vs programmer errors](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/operationalvsprogrammererror.md#distinguish-operational-vs-programmer-errors)

TODO

#### [2.4 Handle errors centrally. Not within middlewares](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md)

All errors are handled by the [error handler](./src/error-handler), mounted at the
[app](./src/app.ts) file.

#### [2.5 Document API errors using OpenAPI Specification (earlier known as Swagger) or GraphQL](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/documentingusingswagger.md#document-api-errors-using-openapi-specification-earlier-known-as-swagger-or-graphql)

TODO

For now, when an error happens it uses sends a well defined [error response](./src/error-handler/error-response.ts)
with the `code` property set to a [http reason phrase](https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html).

#### [2.6 Exit the process gracefully when a stranger comes to town](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/shuttingtheprocess.md#exit-the-process-gracefully-when-a-stranger-comes-to-town)

TODO

#### [2.7 Use a mature logger to increase error visibility](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/usematurelogger.md)

I'm using [`pino`](https://github.com/pinojs/pino#pino) and [`pino-http`](https://github.com/pinojs/pino/blob/master/docs/web.md#http).

#### [2.8 Test error flows using your favorite test framework](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/testingerrorflows.md)

For unit tests, I'm using [`jest`](https://jestjs.io/docs/en/expect#tothrowerror) to [test for the
correct `Error` instance](./src/journals/journals-service.test.ts).

For integrated tests, I'm using [`supertest`](https://github.com/visionmedia/supertest#supertest) to
[test for the expected errors](./src/journals/journals-router.test.ts).

#### [2.9 Discover errors and downtime using APM products](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/apmproducts.md)

TODO

#### [2.10 Catch unhandled promise rejections](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/catchunhandledpromiserejection.md#catch-unhandled-promise-rejections)

TODO

#### [2.11 Fail fast, validate arguments using a dedicated library](https://github.com/goldbergyoni/nodebestpractices#-211-fail-fast-validate-arguments-using-a-dedicated-library)

I'm using [`celebrate`](https://github.com/arb/celebrate/#readme), a middleware
build on top of [`joi`](https://github.com/sideway/joi#readme), to validate the
request before passing it to the route callback. [See](./src/journals/journals-router.ts).

### 3. Code Style Practices

#### [3.1 Use eslint](https://github.com/goldbergyoni/nodebestpractices#-31-use-eslint)

I'm using [Typescript ESLint](https://github.com/typescript-eslint/typescript-eslint/#readme)
combined with [`prettier`](https://github.com/prettier/eslint-config-prettier/#readme),
[`husky`](https://typicode.github.io/husky/#/) and [`lint-staged`](https://github.com/okonet/lint-staged#readme)
to assure good coding style and format before commits.

#### [3.9 Require modules by folders, as opposed to the files directly](https://github.com/goldbergyoni/nodebestpractices#-39-require-modules-by-folders-as-opposed-to-the-files-directly)

As an example of this practice [see](./src/infrastructure). It also [avoids using default exports](https://basarat.gitbook.io/typescript/main-1/defaultisbad).

### 4. Testing And Overall Quality Practices

#### [4.1 At the very least, write API (component) testing](https://github.com/goldbergyoni/nodebestpractices#-41-at-the-very-least-write-api-component-testing)

This codebase has 100% coverage: see [`jest's coverageThreshold`](https://jestjs.io/docs/en/configuration#coveragethreshold-object)
configuration at [`jest.config.ts`](./jest.config.ts).

#### [4.2 Include 3 parts in each test name](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/testingandquality/3-parts-in-name.md)

I'm using the [Given, When, Then](https://martinfowler.com/bliki/GivenWhenThen.html) convention for
test names.

#### [4.3 Structure tests by the AAA pattern](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/testingandquality/aaa.md)

[Yes](./src/journals/journals-service.test.ts).

#### [4.5 Avoid global test fixtures and seeds, add data per-test](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/testingandquality/avoid-global-test-fixture.md)

I'm using a [`cleanDb`]('./src/test-utils/clean-db.ts') function to clean the
database before each test ([See]('./src/journals/journals-service.test.ts')).

#### [4.6 Constantly inspect for vulnerable dependencies](https://github.com/goldbergyoni/nodebestpractices#-46-constantly-inspect-for-vulnerable-dependencies)

TODO

#### [4.7 Tag your tests](https://github.com/goldbergyoni/nodebestpractices#-47-tag-your-tests)

TODO

#### [4.8 Check your test coverage, it helps to identify wrong test patterns](https://github.com/goldbergyoni/nodebestpractices#-48-check-your-test-coverage-it-helps-to-identify-wrong-test-patterns)

This codebase has [100% test coverage](./jest.config.ts)

#### [4.9 Inspect for outdated packages](https://github.com/goldbergyoni/nodebestpractices#-49-inspect-for-outdated-packages)

TODO

#### [4.10 Use production-like environment for e2e testing](https://github.com/goldbergyoni/nodebestpractices#-410-use-production-like-environment-for-e2e-testing)

TODO

#### [4.11 Refactor regularly using static analysis tools](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/testingandquality/refactoring.md)

TODO

#### [4.12 Carefully choose your CI platform](https://github.com/goldbergyoni/nodebestpractices#-412-carefully-choose-your-ci-platform-jenkins-vs-circleci-vs-travis-vs-rest-of-the-world)

TODO

#### [4.13 Test your middlewares in isolation](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/testingandquality/test-middlewares.md)

TODO

### 5. Going To Production Practices

#### [5.1. Monitoring](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/monitoring.md)

TODO

#### [5.2. Increase transparency using smart logging](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/smartlogging.md)

TODO

#### [5.3 Delegate anything possible (e.g. static content, gzip) to a reverse proxy](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/delegatetoproxy.md)

No static content is being served from this application.

#### [5.4. Lock dependencies](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/lockdependencies.md)

A `package-lock.json` file is [automatically generated by npm](https://docs.npmjs.com/cli/v7/configuring-npm/package-lock-json).

#### [5.5 Guard and restart your process upon failure (using the right tool)](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/guardprocess.md)

TODO

#### [5.6 Utilize all CPU cores](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/utilizecpu.md)

TODO

#### [5.7 Create a maintenance endpoint](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/createmaintenanceendpoint.md#create-a-maintenance-endpoint)

TODO

#### [5.8. Discover errors and downtime using APM products](https://github.com/goldbergyoni/nodebestpractices#-58-discover-errors-and-downtime-using-apm-products)

TODO

#### [5.9 Make your code production-ready](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/productioncode.md#make-your-code-production-ready)

TODO

#### [5.10 Measure and guard the memory usage](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/measurememory.md)

TODO

#### [5.11 Get your frontend assets out of Node](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/frontendout.md)

No frontend assets are being served from this application.

#### [5.12 Be stateless, kill your Servers almost every day](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/bestateless.md)

TODO

#### [5.13 Use tools that automatically detect vulnerable dependencies](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/detectvulnerabilities.md)

TODO

#### [5.14 Assign ‘TransactionId’ to each log statement](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/assigntransactionid.md)

TODO

#### [5.15 Set NODE_ENV=production](https://github.com/goldbergyoni/nodebestpractices#-515-set-node_envproduction)

TODO

#### [5.16. Design automated, atomic and zero-downtime deployments](https://github.com/goldbergyoni/nodebestpractices#-516-design-automated-atomic-and-zero-downtime-deployments)

TODO

#### [5.17 Use an LTS release of Node.js in production](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/LTSrelease.md#use-an-lts-release-of-nodejs-in-production)

Set the [node engine](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#engines) to ["^14.16.0"](https://nodejs.org/en/about/releases/).
To see what this means, see this [StackOverflow answer](https://stackoverflow.com/a/22345808/819720).

#### [5.18 Your application code should not handle log routing](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/production/logrouting.md#your-application-code-should-not-handle-log-routing)

Logs are being written to `stdout/stderr`.

TODO: use an aggregation service.

#### [5.19](https://github.com/goldbergyoni/nodebestpractices#-519-install-your-packages-with-npm-ci)

TODO

### 6. Security Best Practices

#### [6.1. Embrace linter security rules](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/lintrules.md)

## Special Thanks

Big thanks to [Carter Bancroft](https://carterbancroft.com/mocking-json-web-tokens-and-auth0/) for
writing a process to run integration tests when [Auth0 token validation](https://auth0.com/docs/quickstart/backend/nodejs#validate-access-tokens)
is in place.
