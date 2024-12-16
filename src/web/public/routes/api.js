const express = require('express');
const fs = require('fs');
const path = require('path');
const configLoader = require('../../../utils/configLoader'); // Assuming you have a config loader utility
const defaultConfigPath = path.join(__dirname, '../../../config/defaultConfig.json');
const userConfigPath = path.join(__dirname, '../../../config/userConfig.json');

const router = express.Router();

/**
 * Helper function to load the current configuration.
 */
function loadConfig() {
    return configLoader(userConfigPath) || configLoader(defaultConfigPath);
}

/**
 * Helper function to save the updated configuration.
 * @param {Object} newConfig - The updated configuration object.
 */
function saveConfig(newConfig) {
    fs.writeFileSync(userConfigPath, JSON.stringify(newConfig, null, 2));
}

// Serve static files from the 'public' directory
router.use(express.static(path.join(__dirname, './web/public')));

router.get('/web', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'dashboard.html'));
});

// GET /reqweb/api/config - Retrieve the current configuration
router.get('/config', (req, res) => {
    try {
        const config = loadConfig();
        res.json({ success: true, config });
    } catch (error) {
        console.error('Error loading configuration:', error);
        res.status(500).json({ success: false, message: 'Failed to load configuration.' });
    }
});

// POST /reqweb/api/config - Update the configuration
router.post('/config', (req, res) => {
    try {
        const updatedConfig = req.body;
        saveConfig(updatedConfig);
        res.json({ success: true, message: 'Configuration updated successfully.' });
    } catch (error) {
        console.error('Error saving configuration:', error);
        res.status(500).json({ success: false, message: 'Failed to save configuration.' });
    }
});

// GET /reqweb/api/status - Check the status of the WAF
router.get('/status', (req, res) => {
    res.json({ success: true, message: 'ReqWeb WAF is running.' });
});

// POST /reqweb/api/test - Test an IP or request against the WAF
router.post('/test', (req, res) => {
    const { ip, requestDetails } = req.body;

    // Add logic to test the IP or request against the current rules (example placeholder)
    const result = {
        ipBlocked: false, // Replace with your logic
        requestBlocked: false, // Replace with your logic
    };

    res.json({ success: true, result });
});

module.exports = router;
