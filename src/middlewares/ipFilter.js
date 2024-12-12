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
    const matcher = new cidrMatcher(config.ipFiltering.blockedIps || []);
    console.log(`BLOCKED IPs: ${JSON.stringify(config.ipFiltering.blockedIps)}`)
    // Optional: Create a separate matcher for allowed IPs
    const allowMatcher = config.allowedIPs ? new cidrMatcher(config.allowedIPs) : null;

    return (req, res, next) => {
        const clientIP = req.ip
        console.log(typeof clientIP);
        console.log(allowMatcher);
        console.log(`<<<<<<< CLIENT IP >>>>>>>>> ${clientIP}`);
        console.log(`<<<<<< Matcher >>>>>> ${JSON.stringify(matcher)}`)
        // Check allowed IPs first if defined
        if (allowMatcher && allowMatcher.contains(clientIP)) {
            console.log(`Executed..`)
            return next(); // Explicitly allowed
        }

        // Block if the IP is in the blacklist
        if (matcher.contains(clientIP)) {
            console.log(`Should be blocked`);
            return res.status(403).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Access Denied</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            background-color: #f8d7da;
                            color: #721c24;
                            margin: 0;
                            padding: 0;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            height: 100vh;
                        }
                        h1 {
                            font-size: 3rem;
                        }
                        p {
                            font-size: 1.5rem;
                        }
                    </style>
                </head>
                <body>
                    <h1>Access Denied</h1>
                    <p>Your IP (${clientIP}) is blocked.</p>
                    <p>If you believe this is an error, please contact the administrator.</p>
                </body>
                </html>
            `);
        }
        
        // Proceed to the next middleware
        next();
    };
};
