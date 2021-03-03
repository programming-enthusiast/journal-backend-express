import { config } from '../config';
import pino from 'pino';

export const logger = pino({
  prettyPrint: true,
  level: config.log.level,
});
