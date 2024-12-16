// index.js: Entry point for the WAF package

const express = require('express');
const ipFilter = require('./middlewares/ipFilter');
const rateLimiter = require('./middlewares/rateLimiter');
const ruleEngine = require('./middlewares/ruleEngine');
const logger = require('./middlewares/logger');
const fs = require('fs');
const path = require('path');
const configLoader = require('./utils/configLoader');
const apiRoutes = require('./web/public/routes/api');
// Load configuration
const config = configLoader('./src/config/userConfig.json');
// Path to the configuration file
const configFilePath = path.join(__dirname, './config', 'defaultConfig.json');
const userConfigFilePath = path.join(__dirname, './config','userConfig.json');
// Create an Express api
const api = express();

// Serve static files from the 'public' directory
api.use(express.static(path.join(__dirname, './web/public')));

// Serve the dashboard HTML on the root route
api.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './web/public', 'dashboard.html'));
});

// Middleware to parse JSON bodies
api.use(express.json());

// apily WAF middlewares
api.use(logger(config));        // Logging middleware
api.use(ipFilter(config));     // IP filtering middleware
api.use(rateLimiter(config));  // Rate limiting middleware
api.use(ruleEngine(config));   // Rule-based request blocking



/**
 * Load configuration from file
 */
function loadConfig() {
    try {
        const data = fs.readFileSync(userConfigFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading configuration:', error);
        return {};
    }
}

/**
 * Save configuration to file
 */
function saveConfig(config) {
    try {
        fs.writeFileSync(userConfigFilePath, JSON.stringify(config, null, 4), 'utf-8');
    } catch (error) {
        console.error('Error saving configuration:', error);
        throw error;
    }
}

/**
 * GET /api/config - Fetch the current configuration
 */
// api.get('/api/config', (req, res) => {
//     try {
//         const config = loadConfig();
//         res.json(config);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to load configuration.' });
//     }
// });

// /**
//  * POST /api/config - Update the configuration
//  */
// api.post('/api/config', (req, res) => {
//     try {
//         const updatedConfig = req.body;
//         // Validate the incoming configuration
//         if (!Array.isArray(updatedConfig.ipFiltering.blockedIps)) {
//             return res.status(400).json({ error: 'Invalid blockedIPs format. Must be an array of strings.' });
//         }

//         if (updatedConfig.ipFiltering.allowedIps && !Array.isArray(updatedConfig.ipFiltering.allowedIps)) {
//             return res.status(400).json({ error: 'Invalid allowedIPs format. Must be an array of strings.' });
//         }

//         if (updatedConfig.rateLimiting.enabled) {
//             const { timeWindow, maxRequests } = updatedConfig.rateLimiting;
//             if (typeof timeWindow !== 'number' || typeof maxRequests !== 'number') {
//                 return res.status(400).json({ error: 'Invalid rateLimiter format. windowMs and maxRequests must be numbers.' });
//             }
//         }

//         // Save the updated configuration to the file
//         saveConfig(updatedConfig);

//         res.json({ message: 'Configuration updated successfully.' });
//     } catch (error) {
//         console.error('Error saving configuration:', error);
//         res.status(500).json({ error: 'Failed to save configuration.' });
//     }
// });

// // Test route for the apilication
// // api.get('/', (req, res) => {
// //     res.send('WAF is active and protecting this server!');
// // });

// // Handle errors
// api.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });



// // const port = process.env.PORT || 3000;
// // // Start the server
// // // const PORT = config.port || 3000;
// // api.listen(port, () => {
// //     console.log(`Server is running on port ${port}`);
// // });

// module.exports = api;


/**
 * Attach the ReqWeb middleware and start the web interface.
 * @param {Object} app - The existing Express app instance.
 * @param {number} port - The port to run the interface on.
 */
function startInterface(app, port = 3000) {
    // Serve the dashboard HTML
    app.use('/web', express.static(path.join(__dirname, './web/public')));

    // Attach API routes
    app.use('/reqweb/api', apiRoutes);

    // Start the server
    app.listen(port, () => {
        console.log(`ReqWeb Dashboard is running at http://localhost:${port}/reqweb`);
    });
}

module.exports = {
    startInterface,
};