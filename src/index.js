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
const userConfigFilePath = path.join(__dirname, './config','userConfig.json');


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
 * Attach the ReqWeb middleware and start the web interface.
 * @param {Object} app - The existing Express app instance.
 * @param {number} port - The port to run the interface on.
 */
function startInterface(app, port = 3000) {

    // aply WAF middlewares
    // app.use(logger(config));        // Logging middleware
    // app.use(ipFilter(config));     // IP filtering middleware
    // app.use(rateLimiter(config));  // Rate limiting middleware
    // app.use(ruleEngine(config));   // Rule-based request blocking
    // Serve the dashboard HTML
    app.use('/web', express.static(path.join(__dirname, './web/public')));

    // Attach API routes
    app.use('/reqweb/api', apiRoutes);

    // Start the server
    app.listen(port, () => {
        console.log(`ReqWeb Dashboard is running at http://localhost:${port}/reqweb/api/web`);
    });
}

module.exports = {
    startInterface,
};