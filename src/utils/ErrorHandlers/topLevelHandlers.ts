import { SignalConstants } from 'os';
import Winston from '../../infra/winston/winston';

const logger = Winston.getInstance();

export const handleError = (error: Error) => {
  logger.error(error.message);
  process.exit(1);
};

export const handleSignal = (signal: SignalConstants) => {
  logger.info(`Signal ${signal} triggers, exiting...`);
  process.exit(0);
};
