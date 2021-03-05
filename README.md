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

#### [2.12 Always await promises before returning to avoid a partial stacktrace](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/returningpromises.md)

All [`async`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#description) function calls are
being `await`ed.

### 3. Code Style Practices

#### [3.1 Use eslint](https://github.com/goldbergyoni/nodebestpractices#-31-use-eslint)

I'm using [Typescript ESLint](https://github.com/typescript-eslint/typescript-eslint/#readme)
combined with [`prettier`](https://github.com/prettier/eslint-config-prettier/#readme),
[`husky`](https://typicode.github.io/husky/#/) and [`lint-staged`](https://github.com/okonet/lint-staged#readme)
to assure good coding style and format before commits.

#### [3.2 Node.js specific plugins](https://github.com/goldbergyoni/nodebestpractices#-32-nodejs-specific-plugins)

I'm using [`eslint-plugin-security`](https://www.npmjs.com/package/eslint-plugin-security).

#### [3.3 Start a Codeblock's Curly Braces on the Same Line](https://github.com/goldbergyoni/nodebestpractices#-33-start-a-codeblocks-curly-braces-on-the-same-line)

This is being enforced by [`@typescript-eslint/eslint-plugin`](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin).

#### [3.4 Separate your statements properly](https://github.com/goldbergyoni/nodebestpractices#-34-separate-your-statements-properly)

Semi-colons are being enforced with [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier).

#### [3.5 Name your functions](https://github.com/goldbergyoni/nodebestpractices#-35-name-your-functions)

I'm using `function` instead of `const` to declare functions. For a discussion on the topic, [see](https://stackoverflow.com/questions/33040703/proper-use-of-const-for-defining-functions-in-javascript).

#### [3.6 Use naming conventions for variables, constants, functions and classes](https://github.com/goldbergyoni/nodebestpractices#-36-use-naming-conventions-for-variables-constants-functions-and-classes)

I'm using lowerCamelCase when naming constants, variables and functions and UpperCamelCase (capital first letter as well) when naming classes.

#### [3.7 Prefer const over let. Ditch the var](https://github.com/goldbergyoni/nodebestpractices#-37-prefer-const-over-let-ditch-the-var)

There are no `var` declarations in the code.

#### [3.8 Require modules first, not inside functions](https://github.com/goldbergyoni/nodebestpractices#-38-require-modules-first-not-inside-functions)

All no `import`/`require` statements in the application code are on the top of the files.

#### [3.9 Require modules by folders, as opposed to the files directly](https://github.com/goldbergyoni/nodebestpractices#-39-require-modules-by-folders-as-opposed-to-the-files-directly)

As an example of this practice [see](./src/infrastructure). It also [avoids using default exports](https://basarat.gitbook.io/typescript/main-1/defaultisbad).

#### [3.10 Use the === operator](https://github.com/goldbergyoni/nodebestpractices#-310-use-the--operator)

I'm only using the `===` for equality comparisons.

#### [3.11 Use Async Await, avoid callbacks](https://github.com/goldbergyoni/nodebestpractices#-311-use-async-await-avoid-callbacks)

I'm using `async/await` instead of callbacks.

#### [3.12 Use arrow function expressions (=>)](https://github.com/goldbergyoni/nodebestpractices#-312-use-arrow-function-expressions-)

Arrow function expressions are being used whenever declaring a named function feels cumbersome.

### 4. Testing And Overall Quality Practices

#### [4.1 At the very least, write API (component) testing](https://github.com/goldbergyoni/nodebestpractices#-41-at-the-very-least-write-api-component-testing)

This codebase has 100% coverage: see [`jest's coverageThreshold`](https://jestjs.io/docs/en/configuration#coveragethreshold-object)
configuration at [`jest.config.ts`](./jest.config.ts).

#### [4.2 Include 3 parts in each test name](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/testingandquality/3-parts-in-name.md)

I'm using the [Given, When, Then](https://martinfowler.com/bliki/GivenWhenThen.html) convention for
test names.

#### [4.3 Structure tests by the AAA pattern](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/testingandquality/aaa.md)

[Yes](./src/journals/journals-service.test.ts).

#### [4.4 Detect code issues with a linter](https://github.com/goldbergyoni/nodebestpractices#-44-detect-code-issues-with-a-linter)

I'm using [`eslint`](https://eslint.org/).

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

I'm using [`eslint-lint-plugin-security`](https://github.com/nodesecurity/eslint-plugin-security).

#### [6.2 Limit concurrent requests using a balancer or a middleware](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/limitrequests.md#limit-concurrent-requests-using-a-balancer-or-a-middleware)

TODO

#### [6.3 Extract secrets from config files or use npm package that encrypts them](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/secretmanagement.md)

TODO: I'm using [`dotenv`](https://github.com/motdotla/dotenv#readme) to speed-up local
development, but in Production I will use environment variables.

#### [6.4 Preventing database injection vulnerabilities by using ORM/ODM libraries or other DAL packages](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/ormodmusage.md)

I'm using [`knex`](https://github.com/knex/knex#knexjs) as my relational database
data access library. The only [`raw`](http://knexjs.org/#Raw) queries are located
in the migration files.

#### [6.5 Common Node.js security best practices](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md)

##### [Use SSL/TLS to encrypt the client-server connection](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-use-ssltls-to-encrypt-the-client-server-connection)

TODO

##### [OWASP A2: Broken Authentication](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-owasp-a2-broken-authentication)

TODO

##### [OWASP A5:  Broken access control](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-owasp-a5-broken-access-control)

TODO

##### [OWASP A6: Security Misconfiguration](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-owasp-a6-security-misconfiguration)

##### [OWASP A3: Sensitive Data Exposure](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-owasp-a3-sensitive-data-exposure)

TODO

##### [OWASP A9: Using Components With Known Security Vulneraibilities](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-owasp-a9-using-components-with-known-security-vulneraibilities)

TODO

##### [OWASP A10: Insufficient Logging & Monitoring](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-owasp-a10-insufficient-logging--monitoring)

TODO

##### [OWASP A7: Cross-Site-Scripting (XSS)](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-owasp-a7-cross-site-scripting-xss)

TODO

##### [Protect Personally Identifyable Information (PII Data)](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-protect-personally-identifyable-information-pii-data)

TODO

##### [Have a security.txt File [PRODUCTION]](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-have-a-securitytxt-file-production)

TODO

##### [Have a SECURITY.md File [OPEN SOURCE]](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/commonsecuritybestpractices.md#-have-a-securitymd-file-open-source)

TODO

#### [6.6. Adjust the HTTP response headers for enhanced security](https://github.com/goldbergyoni/nodebestpractices#-66-adjust-the-http-response-headers-for-enhanced-security)

I'm using [`helmet`](https://helmetjs.github.io/) for that.

#### [6.7 Constantly and automatically inspect for vulnerable dependencies](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/dependencysecurity.md)

TODO

#### [6.8. Protect Users' Passwords/Secrets using bcrypt or scrypt](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/userpasswords.md)

I'm not storing User passwords nor secrets. Instead, I'm using [Auth0](https://auth0.com/).

#### [6.9. Escape HTML, JS and CSS output](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/escape-output.md)

TODO

#### [6.10. Validate incoming JSON schemas](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/validation.md)

I'm using [`celebrate`](https://github.com/arb/celebrate) to validate incoming payloads. [See](./src/journals/journals-router.ts).

#### [6.11. Support blocklisting JWTs](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/expirejwt.md)

TODO

#### [6.12 Prevent brute-force attacks against authorization](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/login-rate-limit.md)

TODO

#### [6.13. Run Node.js as non-root user](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/non-root-user.md)

TODO

#### [6.14 Limit payload size using a reverse-proxy or a middleware](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/requestpayloadsizelimit.md)

TODO

#### [6.15. Avoid JavaScript eval statements](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/avoideval.md)

Not using any of these functions.

#### [6.16 Prevent evil RegEx from overloading your single thread execution](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/regex.md)

I'm using [node-re2](https://github.com/uhop/node-re2/#README). According to it's documentation:

> RE2 consciously avoids any regular expression features that require worst-case exponential time to evaluate[...]RE2 will throw a SyntaxError if you try to declare a regular expression using these features.

#### [6.17 Avoid module loading using a variable](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/safemoduleloading.md)

This is being avoided.

#### [6.18 Run unsafe code in a sandbox](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/sandbox.md)

TODO.

#### [6.19. Take extra care when working with child processes](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/childprocesses.md)

I'm not using the `child_process` module in the `express` application.

#### [6.20. Hide error details from clients](https://github.com/goldbergyoni/nodebestpractices#-620-hide-error-details-from-clients)

I'm returning only an error code and the `Error` message in some cases. [See](./src/error-handler/error-handler.ts).

#### [6.21. Configure 2FA for npm or Yarn](https://github.com/goldbergyoni/nodebestpractices#-621-configure-2fa-for-npm-or-yarn)

No packages are being published to [`npm`](https://www.npmjs.com/).

#### [6.22 Modify session middleware settings](https://github.com/goldbergyoni/nodebestpractices#-622-modify-session-middleware-settings)

TODO

#### [6.23. Avoid DOS attacks by explicitly setting when a process should crash](https://github.com/goldbergyoni/nodebestpractices#-623-avoid-dos-attacks-by-explicitly-setting-when-a-process-should-crash)

TODO

#### [6.24 Prevent unsafe redirects](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/saferedirects.md#prevent-unsafe-redirects)

This application is not doing redirects.

#### [6.25. Avoid publishing secrets to the npm registry](https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/security/avoid_publishing_secrets.md)

No packages are being published to [`npm`](https://www.npmjs.com/).

## Special Thanks

Big thanks to [Carter Bancroft](https://carterbancroft.com/mocking-json-web-tokens-and-auth0/) for
writing a process to run integration tests when [Auth0 token validation](https://auth0.com/docs/quickstart/backend/nodejs#validate-access-tokens)
is in place.
