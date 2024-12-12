// alert.js: Middleware for Logging and Alerting

const nodemailer = require('nodemailer');
const winston = require('winston');

/**
 * Alerting Middleware
 * Logs incidents and sends alerts when specific conditions are met.
 * @param {Object} config - Configuration object with alert settings.
 * @param {Object} config.alerting.email - Email alert configuration.
 * @param {string} config.alerting.email.from - Sender email address.
 * @param {string} config.alerting.email.to - Recipient email address.
 * @param {string} config.alerting.email.subject - Email subject.
 * @param {Object} config.logging - Logging configuration.
 * @returns {Function} Middleware function for logging and alerting.
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
            new winston.transports.File({ filename: config.logging.file || 'alert-logs.log' }),
        ],
    });

    const transporter = nodemailer.createTransport(config.alerting.email.transport);

    return (req, res, next) => {
        const alertCondition = req.headers['x-suspicious'] === 'true'; // Example condition

        if (alertCondition) {
            const alertDetails = {
                timestamp: new Date().toISOString(),
                ip: req.ip,
                method: req.method,
                url: req.url,
                headers: req.headers,
            };

            logger.warn({
                message: 'Suspicious activity detected',
                details: alertDetails,
            });

            const emailOptions = {
                from: config.alerting.email.from,
                to: config.alerting.email.to,
                subject: config.alerting.email.subject || 'Suspicious Activity Detected',
                text: `Suspicious activity detected:

${JSON.stringify(alertDetails, null, 2)}`,
            };

            transporter.sendMail(emailOptions, (err, info) => {
                if (err) {
                    logger.error('Failed to send alert email:', err);
                } else {
                    logger.info('Alert email sent:', info.response);
                }
            });
        }

        next();
    };
};
