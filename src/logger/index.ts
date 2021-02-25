import config from '../config';
import pino from 'pino';

const logger = pino({
  prettyPrint: true,
  level: config.log.level,
});

export default logger;
