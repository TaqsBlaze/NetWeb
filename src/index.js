// index.js: Entry point for the WAF package

const express = require('express');
const ipFilter = require('./middlewares/ipFilter');
const rateLimiter = require('./middlewares/rateLimiter');
const ruleEngine = require('./middlewares/ruleEngine');
const logger = require('./middlewares/logger');

const configLoader = require('./utils/configLoader');

// Load configuration
const config = configLoader('./src/config/userConfig.json');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Apply WAF middlewares
app.use(logger(config));        // Logging middleware
app.use(ipFilter(config));     // IP filtering middleware
app.use(rateLimiter(config));  // Rate limiting middleware
app.use(ruleEngine(config));   // Rule-based request blocking

// Test route for the application
app.get('/', (req, res) => {
    res.send('WAF is active and protecting this server!');
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
