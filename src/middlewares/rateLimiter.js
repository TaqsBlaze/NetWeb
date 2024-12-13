const rateLimit = require('express-rate-limit');

/**
 * Rate Limiter Middleware
 * Limits the number of requests a client can make within a specified time frame.
 * Configuration is loaded from the provided config object.
 * 
 * @param {Object} config - Configuration object for rate limiting.
 * @param {number} config.windowMs - Time frame for rate limiting in milliseconds.
 * @param {number} config.maxRequests - Maximum number of requests allowed in the time frame.
 * @param {string} [config.message] - Custom message for rate limit exceeded.
 * @returns {Function} Middleware function for rate limiting.
 */
module.exports = (config) => {
    const limiter = rateLimit({
        windowMs: config.windowMs || 60000, // Default: 1 minute
        max: config.maxRequests || 100, // Default: 100 requests per windowMs
        message: config.message || 'Too many requests, please try again later.',
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false,  // Disable `X-RateLimit-*` headers
        keyGenerator: (req) => {
            // Use the client's IP address for rate limiting
            return req.ip;
        },
        handler: (req, res, next, options) => {
            // Custom response for rate limit exceeded
            res.status(429).send(`
                <html>
                    <head>
                        <title>Rate Limit Exceeded</title>
                    </head>
                    <body>
                        <h1>Too Many Requests</h1>
                        <p>${options.message}</p>
                    </body>
                </html>
            `);
        },
    });

    return limiter;
};
