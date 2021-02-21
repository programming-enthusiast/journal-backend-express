/* eslint-disable @typescript-eslint/no-var-requires */
describe('config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  describe('env', () => {
    test('Given environment variable NODE_ENV not defined then should return development', () => {
      delete process.env.NODE_ENV

      const config = require('./config').default

      expect(config.env).toBe('development')
    })

    test.each(['development', 'test', 'production'])(
      "Given environment variable NODE_ENV %p defined then should return it's value",
      (env) => {
        process.env.NODE_ENV = env

        const config = require('./config').default

        expect(config.env).toBe(env)
      }
    )

    test('Given invalid environment variable NODE_ENV then should throw', () => {
      process.env.NODE_ENV = 'invalid'

      expect(() => {
        require('./config')
      }).toThrow(
        'Config validation error: "NODE_ENV" must be one of [development, test, production]'
      )
    })
  })

  describe('port', () => {
    test("Given environment variable PORT defined then should return it's value", () => {
      process.env.PORT = '8080'

      const config = require('./config').default

      expect(config.port).toBe(8080)
    })
    test('Given environment variable PORT not defined then should return 3000', () => {
      delete process.env.PORT

      const config = require('./config').default

      expect(config.port).toBe(3000)
    })

    test('Given environment variable PORT less than 0 then should throw', () => {
      process.env.PORT = '-1'

      expect(() => {
        require('./config')
      }).toThrow(
        'Config validation error: "PORT" must be greater than or equal to 0'
      )
    })

    test('Given environment variable PORT greater than 65535 then should throw', () => {
      const port = Math.pow(2, 16)

      process.env.PORT = port.toString()

      expect(() => {
        require('./config')
      }).toThrow(
        'Config validation error: "PORT" must be less than or equal to 65535'
      )
    })

    test('Given environment variable PORT that cannot be parsed to an integer then should throw', () => {
      const port = 0.1

      process.env.PORT = port.toString()

      expect(() => {
        require('./config')
      }).toThrow('Config validation error: "PORT" must be an integer')
    })

    test.each(['', ' ', 'a-string'])(
      'Given environment variable PORT that cannot be parsed to a number then should throw',
      (value) => {
        process.env.PORT = value.toString()

        expect(() => {
          require('./config')
        }).toThrow('Config validation error: "PORT" must be a number')
      }
    )
  })

  describe('db', () => {
    describe('client', () => {
      test('Should be postgresql', () => {
        const client = 'postgresql'

        const config = require('./config').default

        expect(config.db).toMatchObject({ client })
      })
    })

    describe('connection', () => {
      describe('host', () => {
        test("Given environment variable PGHOST defined then should return it's value", () => {
          const host = 'my-pg-host'

          process.env.PGHOST = host

          const config = require('./config').default

          expect(config.db.connection).toMatchObject({ host })
        })

        test('Given environment variable PGHOST not defined then should throw', () => {
          delete process.env.PGHOST

          expect(() => {
            require('./config')
          }).toThrow('Config validation error: "PGHOST" is required')
        })
      })

      describe('port', () => {
        test("Given environment variable PGPORT defined then should return it's value", () => {
          const port = 8080

          process.env.PGPORT = port.toString()

          const config = require('./config').default

          expect(config.db.connection).toMatchObject({ port })
        })

        test('Given environment variable PGPORT not defined then should throw', () => {
          delete process.env.PGPORT

          expect(() => {
            require('./config')
          }).toThrow('Config validation error: "PGPORT" is required')
        })

        test('Given environment variable PGPORT less than 0 then should throw', () => {
          process.env.PGPORT = '-1'

          expect(() => {
            require('./config')
          }).toThrow(
            'Config validation error: "PGPORT" must be greater than or equal to 0'
          )
        })

        test('Given environment variable PGPORT greater than 65535 then should throw', () => {
          const port = Math.pow(2, 16)

          process.env.PGPORT = port.toString()

          expect(() => {
            require('./config')
          }).toThrow(
            'Config validation error: "PGPORT" must be less than or equal to 65535'
          )
        })

        test('Given environment variable PGPORT that cannot be parsed to an integer then should throw', () => {
          const port = 0.1

          process.env.PGPORT = port.toString()

          expect(() => {
            require('./config')
          }).toThrow('Config validation error: "PGPORT" must be an integer')
        })

        test.each(['', ' ', 'a-string'])(
          'Given environment variable PGPORT that cannot be parsed to a number then should throw',
          (value) => {
            process.env.PGPORT = value.toString()

            expect(() => {
              require('./config')
            }).toThrow('Config validation error: "PGPORT" must be a number')
          }
        )
      })

      describe('user', () => {
        test("Given environment variable PGUSER defined then should return it's value", () => {
          const user = 'my-pg-user'

          process.env.PGUSER = user

          const config = require('./config').default

          expect(config.db.connection).toMatchObject({ user })
        })

        test('Given environment variable PGUSER not defined then should throw', () => {
          delete process.env.PGUSER

          expect(() => {
            require('./config')
          }).toThrow('Config validation error: "PGUSER" is required')
        })
      })

      describe('password', () => {
        test("Given environment variable PGPASSWORD defined then should return it's value", () => {
          const password = 'my-pg-password'

          process.env.PGPASSWORD = password

          const config = require('./config').default

          expect(config.db.connection).toMatchObject({ password })
        })

        test('Given environment variable PGPASSWORD not defined then should throw', () => {
          delete process.env.PGPASSWORD

          expect(() => {
            require('./config')
          }).toThrow('Config validation error: "PGPASSWORD" is required')
        })
      })

      describe('database', () => {
        test("Given environment variable PGDATABASE defined then should return it's value", () => {
          const database = 'my-database'

          process.env.PGDATABASE = database

          const config = require('./config').default

          expect(config.db.connection).toMatchObject({ database })
        })

        test('Given environment variable PGDATABASE not defined then should throw', () => {
          delete process.env.PGDATABASE

          expect(() => {
            require('./config')
          }).toThrow('Config validation error: "PGDATABASE" is required')
        })
      })
    })
  })
})
