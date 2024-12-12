// ipFilter.js: Middleware for IP Filtering

const cidrMatcher = require('cidr-matcher');

/**
 * IP Filtering Middleware
 * Blocks requests from IPs in the blacklist or allows only whitelisted IPs based on the configuration.
 * @param {Object} config - Configuration object with IP filtering settings.
 * @param {Array<string>} config.blockedIPs - List of blocked IPs or CIDR ranges.
 * @param {Array<string>} [config.allowedIPs] - List of explicitly allowed IPs or CIDR ranges (optional).
 * @returns {Function} Middleware function for IP filtering.
 */
module.exports = (config) => {

    // Add blocked IPs to the matcher
    const matcher = new cidrMatcher(config.blockedIPs || []);

    // Optional: Create a separate matcher for allowed IPs
    const allowMatcher = config.allowedIPs ? new cidrMatcher(config.allowedIPs) : null;

    return (req, res, next) => {
        const clientIP = req.ip;

        // Check allowed IPs first if defined
        if (allowMatcher && allowMatcher.contains(clientIP)) {
            return next(); // Explicitly allowed
        }

        // Block if the IP is in the blacklist
        if (matcher.contains(clientIP)) {
            return res.status(403).json({
                error: 'Access denied: Your IP is blocked.',
                ip: clientIP,
            });
        }

        // Proceed to the next middleware
        next();
    };
};
