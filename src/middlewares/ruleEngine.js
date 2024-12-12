// ruleEngine.js: Middleware for Rule-Based Request Blocking

/**
 * Rule-Based Blocking Middleware
 * Blocks requests based on user-defined rules in the configuration.
 * @param {Object} config - Configuration object with rule settings.
 * @param {Array<Object>} config.rules - Array of rule objects with "pattern" and "message" properties.
 * @returns {Function} Middleware function for rule-based request blocking.
 */
module.exports = (config) => {
    const rules = config.rules || [];

    return (req, res, next) => {
        for (const rule of rules) {
            const regex = new RegExp(rule.pattern);

            // Match the request URL, headers, or body against the rule pattern
            const matchTarget = req.url + JSON.stringify(req.headers) + JSON.stringify(req.body);
            if (regex.test(matchTarget)) {
                return res.status(403).json({
                    error: 'Request blocked by WAF rule.',
                    rule: rule.message || 'Blocked by user-defined rule.',
                });
            }
        }

        next(); // No rule matched, proceed to the next middleware
    };
};
