// logger.js: Middleware for Logging Requests

const winston = require('winston');

/**
 * Logging Middleware
 * Logs incoming requests and their details using Winston.
 * @param {Object} config - Configuration object with logging settings.
 * @param {string} [config.logging.level] - Logging level (e.g., 'info', 'error').
 * @param {string} [config.logging.file] - File to save logs (optional).
 * @returns {Function} Middleware function for logging requests.
 */
module.exports = (config) => {
    const logger = winston.createLogger({
        level: config.logging.level || 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: config.logging.file || 'waf-logs.log' }),
        ],
    });

    return (req, res, next) => {
        const logEntry = {
            timestamp: new Date().toISOString(),
            ip: req.ip,
            method: req.method,
            url: req.url,
            headers: req.headers,
        };

        logger.info(logEntry);
        next();
    };
};
