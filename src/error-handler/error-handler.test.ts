import { CelebrateError, Joi, Segments } from 'celebrate';
import { ErrorResponse } from './error-response';
import { NotFoundError } from '../errors';
import { ReasonPhrases } from 'http-status-codes';
import { Response } from 'express';
import { UnauthorizedError } from 'express-jwt';
import errorHandler from '.';
import logger from '../logger';

describe('error-handler', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn(),
      json: jest.fn(),
    };
  });

  describe('handleError', () => {
    test('Given an instance of NotFoundError then should log the exception and send the correct Response', async () => {
      // Arrange
      const error = new NotFoundError('Journal not found');

      const spy = jest.spyOn(logger, 'error');

      const expectedResponse: ErrorResponse = {
        error: {
          code: ReasonPhrases.NOT_FOUND,
          message: error.message,
        },
      };

      // Act
      await errorHandler.handleError(error, mockResponse as Response);

      // Assert
      expect(spy).toBeCalledWith(error);

      expect(mockResponse.status).toBeCalledWith(404);
      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test('Given an instance of CelebrateError then should log the exception and send the correct Response', async () => {
      // Arrange
      const validationError = new Joi.ValidationError(
        'journalId is required',
        {},
        {}
      );
      const error = new CelebrateError();
      error.details.set(Segments.BODY, validationError);

      const spy = jest.spyOn(logger, 'error');

      const expectedResponse: ErrorResponse = {
        error: {
          code: ReasonPhrases.BAD_REQUEST,
          message: validationError.message,
        },
      };

      // Act
      await errorHandler.handleError(error, mockResponse as Response);

      // Assert
      expect(spy).toBeCalledWith(error);

      expect(mockResponse.status).toBeCalledWith(400);
      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test('Given an instance of UnauthorizedError then should log the exception and send the correct Response', async () => {
      // Arrange
      const message = 'invalid signature';

      const error = new UnauthorizedError('invalid_token', { message });

      const spy = jest.spyOn(logger, 'error');

      const expectedResponse: ErrorResponse = {
        error: {
          code: ReasonPhrases.UNAUTHORIZED,
          message,
        },
      };

      // Act
      await errorHandler.handleError(error, mockResponse as Response);

      // Assert
      expect(spy).toBeCalledWith(error);

      expect(mockResponse.status).toBeCalledWith(401);
      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test('Given another instance of an Error then should log the exception and send the correct Response', async () => {
      // Arrange
      const error = new Error('Something went wrong');

      const spy = jest.spyOn(logger, 'error');

      const expectedResponse: ErrorResponse = {
        error: {
          code: ReasonPhrases.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong',
        },
      };

      // Act
      await errorHandler.handleError(error, mockResponse as Response);

      // Assert
      expect(spy).toBeCalledWith(error);

      expect(mockResponse.status).toBeCalledWith(500);
      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });
  });
});
