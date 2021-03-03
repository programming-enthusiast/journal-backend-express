# Journal Backend - Express

An [Express](https://expressjs.com) application showcasing best practices. A
great list of these practices can be found [here](https://github.com/goldbergyoni/nodebestpractices).

# Features

## 1. Project Structure Practices

### [1.1 Structure your solution by components](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/breakintcomponents.md)

The top level directory structure contains modules such as `users`, `journals`,
and `inspirations` instead of technical roles such as `controllers` or `models`.

### [1.2 Layer your app, keep Express within its boundaries](https://github.com/goldbergyoni/nodebestpractices#-12-layer-your-components-keep-the-web-layer-within-its-boundaries)

The `routers`, for example, deal only with things related to the web layer: requests,
responses, routes themselves. Business logic is located in the `services` modules,
which on their turn use the functionality provided by the infrastructure (including
a database).

For a good reference on layering your app, see Microsoft's [N-tier architecture](https://docs.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier#n-tier-architecture-on-virtual-machines).

### [1.4 Separate Express 'app' and 'server'](https://github.com/goldbergyoni/nodebestpractices#-14-separate-express-app-and-server)

This allows for the application to be tested with tools such as [`supertest`](https://github.com/visionmedia/supertest#supertest)
and [`nock`](https://github.com/nock/nock#nock).

### [1.5 Use environment aware, secure and hierarchical config](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/projectstructre/configguide.md#use-environment-aware-secure-and-hierarchical-config)

I'm using a strategy copied from [FreeCodeCamp](https://github.com/freeCodeCamp/freeCodeCamp),
using a combination of [`dotenv`](https://github.com/motdotla/dotenv#readme) and
[`joi`](https://github.com/sideway/joi#readme) to build a [validated `config` object](./src/config.ts).

## 2. Error Handling Practices

### [2.1 Use Async-Await or promises for async error handling](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/asyncerrorhandling.md#use-async-await-or-promises-for-async-error-handling)

I'm using [Typescript](https://www.typescriptlang.org/) so the `async/await` style
of handling errors comes naturally. For an example, See the [journals-router](./src/journals/journals-router.ts).

### [2.2 Use only the built-in Error object](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/useonlythebuiltinerror.md#use-only-the-built-in-error-object)

The code only throws [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) objects
or instances of [classes that extend it](./src/errors).

### [2.3 Distinguish operational vs programmer errors](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/operationalvsprogrammererror.md#distinguish-operational-vs-programmer-errors)

TODO

### [2.4 Handle errors centrally. Not within middlewares](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md)

All errors are handled by the [error handler](./src/error-handler), mounted at the
[app](./src/app.ts) file.

### [2.5 Document API errors using OpenAPI Specification (earlier known as Swagger) or GraphQL](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/documentingusingswagger.md#document-api-errors-using-openapi-specification-earlier-known-as-swagger-or-graphql)

TODO

For now, when an error happens it uses sends a well defined [error response](./src/error-handler/error-response.ts)
with the `code` property set to a [http reason phrase](https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html).

### [2.6 Exit the process gracefully when a stranger comes to town](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/shuttingtheprocess.md#exit-the-process-gracefully-when-a-stranger-comes-to-town)

TODO

### [2.7 Use a mature logger to increase error visibility](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/usematurelogger.md)

I'm using [`pino`](https://github.com/pinojs/pino#pino) and [`pino-http`](https://github.com/pinojs/pino/blob/master/docs/web.md#http).

### [2.8 Test error flows using your favorite test framework](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/testingerrorflows.md)

For unit tests, I'm using [`jest`](https://jestjs.io/docs/en/expect#tothrowerror) to [test for the
correct `Error` instance](./src/journals/journals-service.test.ts).

For integrated tests, I'm using [`supertest`](https://github.com/visionmedia/supertest#supertest) to
[test for the expected errors](./src/journals/journals-router.test.ts).

### [2.9 Discover errors and downtime using APM products](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/apmproducts.md)

TODO

### [2.10 Catch unhandled promise rejections](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/catchunhandledpromiserejection.md#catch-unhandled-promise-rejections)
