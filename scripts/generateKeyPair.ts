import { generateKeyPairSync } from 'crypto';
import { passphrase } from '../src/test-utils/jwt';
import { pem2jwk } from 'pem-jwk';

interface JWKS {
  keys: [
    {
      alg: 'RS256';
      kty: string;
      use: 'sig';
      n: string;
      e: string;
      kid: '0';
    }
  ];
}

const generate = async () => {
  try {
    const keys = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase,
      },
    });

    const jwks: JWKS = {
      keys: [
        {
          ...pem2jwk(keys.publicKey),
          alg: 'RS256',
          use: 'sig',
          kid: '0',
        },
      ],
    };

    console.log(keys.publicKey);
    console.log('\n');
    console.log(keys.privateKey);
    console.log('\n');
    console.log(jwks);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

generate();
