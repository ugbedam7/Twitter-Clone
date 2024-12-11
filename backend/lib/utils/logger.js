import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, errors, colorize } = format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Create a Winston logger instance
const logger = createLogger({
  level: 'info', // Default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Capture stack traces for error messages
    logFormat
  ),
  transports: [
    // Add transports below
  ],
  exitOnError: false // Do not exit on handled exceptions
});

// Add a console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(colorize(), logFormat)
    })
  );
}

// Add file transports for production
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new transports.File({
      filename: 'logs/error.log',
      level: 'error'
    })
  );

  logger.add(
    new transports.File({
      filename: 'logs/combined.log'
    })
  );
}

export default logger;
