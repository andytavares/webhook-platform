import { Logger, createLogger, format, transports } from 'winston';

class Winston {
  private static _instance: Logger;

  private constructor() {}

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = createLogger({
      transports: [new transports.Console()],
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    });
    return this._instance;
  }
}

export default Winston;
