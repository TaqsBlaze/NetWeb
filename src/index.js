// index.js: Entry point for the WAF package

const express = require('express');
const ipFilter = require('./middlewares/ipFilter');
const rateLimiter = require('./middlewares/rateLimiter');
const ruleEngine = require('./middlewares/ruleEngine');
const logger = require('./middlewares/logger');
const fs = require('fs');
const path = require('path');
const configLoader = require('./utils/configLoader');

// Load configuration
const config = configLoader('./src/config/userConfig.json');
// Path to the configuration file
const configFilePath = path.join(__dirname, './config', 'defaultConfig.json');
const userConfigFilePath = path.join(__dirname, './config','userConfig.json');
// Create an Express app
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, './web/public')));

// Serve the dashboard HTML on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './web/public', 'dashboard.html'));
});

// Middleware to parse JSON bodies
app.use(express.json());

// Apply WAF middlewares
app.use(logger(config));        // Logging middleware
app.use(ipFilter(config));     // IP filtering middleware
app.use(rateLimiter(config));  // Rate limiting middleware
app.use(ruleEngine(config));   // Rule-based request blocking



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
app.get('/api/config', (req, res) => {
    try {
        const config = loadConfig();
        res.json(config);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load configuration.' });
    }
});

/**
 * POST /api/config - Update the configuration
 */
app.post('/api/config', (req, res) => {
    try {
        const updatedConfig = req.body;
        console.log(`<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n ${JSON.stringify(updatedConfig)}`);
        // Validate the incoming configuration
        if (!Array.isArray(updatedConfig.ipFiltering.blockedIps)) {
            return res.status(400).json({ error: 'Invalid blockedIPs format. Must be an array of strings.' });
        }

        if (updatedConfig.ipFiltering.allowedIps && !Array.isArray(updatedConfig.ipFiltering.allowedIps)) {
            return res.status(400).json({ error: 'Invalid allowedIPs format. Must be an array of strings.' });
        }

        if (updatedConfig.rateLimiting.enabled) {
            const { timeWindow, maxRequests } = updatedConfig.rateLimiting;
            if (typeof timeWindow !== 'number' || typeof maxRequests !== 'number') {
                return res.status(400).json({ error: 'Invalid rateLimiter format. windowMs and maxRequests must be numbers.' });
            }
        }

        // Save the updated configuration to the file
        saveConfig(updatedConfig);

        res.json({ message: 'Configuration updated successfully.' });
    } catch (error) {
        console.error('Error saving configuration:', error);
        res.status(500).json({ error: 'Failed to save configuration.' });
    }
});

// Test route for the application
// app.get('/', (req, res) => {
//     res.send('WAF is active and protecting this server!');
// });

// Handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 3000;
// Start the server
// const PORT = config.port || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
