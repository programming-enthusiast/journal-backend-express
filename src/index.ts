import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line sort-imports
import app from './app';
import config from './config';

app.listen(config.port, () => {
  console.log(`Journal app listening at port ${config.port}`);
});
