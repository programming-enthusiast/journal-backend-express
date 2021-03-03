import { config } from '../config';
import jwt from 'jsonwebtoken';
import nock from 'nock';

const privateKey = `
-----BEGIN ENCRYPTED PRIVATE KEY-----
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
-----END ENCRYPTED PRIVATE KEY-----
`;

export const passphrase = 'my passphrase';

const jwks = {
  keys: [
    {
      kty: 'RSA',
      n:
        '7E8wXmG7syHf5qeG834IayuNJbdFcQMWfdN8E7UXXbk_1wJuQIcRFKQzRY5FG3XZXeIBSKQSM6o1D1WFcBlkxmhzZ25_j3XQidyyID4MAQnAvi5Zc3Yf6xaOMTVqlL1wxg6N_EG_JlILKTPsuuIgvEXMmOs1ubnCGuooaTaH7id07fHY7oWnM8VvqGJ35lQ4VHlaUWaKQfW8IqPgyuBHHPr39Ip18m4crMBFYfX_k8ft5W7CRbgiIyuyzTfflw8MMDOqAAoFReMNOh-5XNabbTCwY6kLC5gcPdp841x-aMr1HQjCy8qOOj8Mc5ZgzWjgjpzzXhqeFEZnNlJo9bqvsIX0-02u6RB1HpR3AdAbXqJYLTQQPECY8jW3QNjQjDgeKfpbyZE64LCmuCEhX8IYSxnf51JTdoOS8Db1I98YcSFI81M8Lc1ZUtG_aSCamBbv4ZQr5tVE3xrx1ToV2ColCcbtt1V05LpEs819-_A6gBO9YxwSIP66-adWe9DwaJ59yPtPShKDzKLeVVDKiFhFfAhOWK14ByvkReXM3B-eky6wRosOsqZ-nXJTOVgk5nRBB21w6hmN6NIQaKPsZdNoPv_QRWr8miqxPsFlpgPfeR-6sTclzKiu2r7ymGa42tYE1qIHo49NdJ6LrZz61gw-j__afgBM9GmV6SFslxDKe1c',
      e: 'AQAB',
      alg: 'RS256',
      use: 'sig',
      kid: '0',
    },
  ],
};

export const interceptGetJWKSRequest = (): void => {
  nock(config.auth0.issuer)
    .persist()
    .get('/.well-known/jwks.json')
    .reply(200, jwks);
};

export const getToken = (userId: string): string => {
  const user = {
    sub: userId,
  };

  const options: jwt.SignOptions = {
    header: { kid: '0' },
    algorithm: 'RS256',
    expiresIn: '1d',
    audience: config.auth0.audience,
    issuer: config.auth0.issuer,
  };

  return jwt.sign(user, { key: privateKey, passphrase }, options);
};
