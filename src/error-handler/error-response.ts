import { ReasonPhrases } from 'http-status-codes';

interface ErrorResponse {
  error: {
    code: ReasonPhrases;
    message: string;
  };
}

export { ErrorResponse };
