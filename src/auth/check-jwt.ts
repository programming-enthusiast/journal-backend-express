import { config } from '../config';
import jwksRsa from 'jwks-rsa';
import jwt from 'express-jwt';

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth0.jwksUri,
  }),
  audience: config.auth0.audience,
  issuer: config.auth0.issuer,
  algorithms: ['RS256'],
});
