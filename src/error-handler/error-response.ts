import { ReasonPhrases } from 'http-status-codes';

export interface ErrorResponse {
  error: {
    code: ReasonPhrases;
    message: string;
  };
}
