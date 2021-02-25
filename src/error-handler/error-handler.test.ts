import { Response } from 'express';
import errorHandler from '.';
import { ErrorCodes, ResponseError } from '../errors';
import logger from '../logger';
import { ErrorResponse } from './error-response';

describe('error-handler', () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleError', () => {
    test('Given an instance of ResponseError then should log the exception and send a json with the code and message from the Error, with http status from the Error', async () => {
      // Arrange
      const error = new ResponseError(
        404,
        ErrorCodes.ItemNotFound,
        'Journal not found'
      );

      const spy = jest.spyOn(logger, 'error');

      const expectedResponse: ErrorResponse = {
        error: {
          code: error.code,
          message: error.message,
        },
      };

      // Act
      await errorHandler.handleError(error, mockResponse as Response);

      // Assert
      expect(spy).toBeCalledWith(error);

      expect(mockResponse.status).toBeCalledWith(error.status);
      expect(mockResponse.json).toBeCalledWith(expectedResponse);
    });

    test('Given an instance of an Error other than ResponseError then should log the exception and send a json with code "generalException" and message "Internal Server Error", with http status 500', async () => {
      // Arrange
      const error = new Error('Something went wrong');

      const spy = jest.spyOn(logger, 'error');

      const expectedResponse: ErrorResponse = {
        error: {
          code: 'generalException',
          message: 'Internal Server Error',
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
