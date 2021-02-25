import pino from 'pino';
import config from '../config';

const logger = pino({
  prettyPrint: true,
  level: config.log.level,
});

export default logger;
