declare namespace Express {
  interface ParsedToken {
    iss: string;
    sub: string;
    aud: string | string[];
    iat: number;
    exp: number;
    azp: string;
    scope: string;
  }

  export interface Request {
    user: ParsedToken;
  }
}
