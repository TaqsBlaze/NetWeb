const fs = require('fs');
const path = require('path');

// Default configuration path
const defaultConfigPath = path.join(__dirname, '../config/defaultConfig.json');

/**
 * Loads the configuration file and merges it with default settings.
 * @returns {Object} Merged configuration object.
 */
function loadConfig() {
  let config;

  try {
    // Attempt to read the config file
    const rawConfig = fs.readFileSync(defaultConfigPath);
    const userConfig = JSON.parse(rawConfig);

    // Merge user config with default values
    config = mergeConfigs(getDefaultConfig(), userConfig);

    console.log("Configuration loaded successfully.");
  } catch (error) {
    console.error("Error loading config:", error.message);
    console.log("Loading default configuration.");

    // Use default config if file is missing or invalid
    config = getDefaultConfig();
  }

  console.log(`LOADED CONFIGS: ${JSON.stringify(config)}`)
  return config;
}

/**
 * Returns the default configuration object.
 * @returns {Object} Default configuration.
 */
function getDefaultConfig() {
  return {
    ipFiltering: {
      enabled: true,
      allowedIps: [],
      blockedIps: [],
      maxRequestsPerMinute: 100,
      banDuration: 3600
    },
    rateLimiting: {
      enabled: true,
      maxRequests: 1000,
      timeWindow: 3600,
      banDuration: 86400
    },
    requestBlocking: {
      enabled: true,
      rules: []
    },
    logging: {
      enabled: true,
      logLevel: 'info',
      logFile: 'waf_logs.json',
      logToFile: true,
      logToConsole: true
    },
    alerting: {
      enabled: true,
      alertLevel: 'high',
      email: 'tanakah30@gmail.com',
      sms: '+263778040497',
      alertThreshold: 5
    },
    general: {
      blockOnBreach: true,
      maxRequestSize: 1048576,
      requestTimeout: 5000
    }
  };
}

/**
 * Merges the user configuration with the default configuration.
 * @param {Object} defaultConfig - Default configuration.
 * @param {Object} userConfig - User-provided configuration.
 * @returns {Object} Merged configuration.
 */
function mergeConfigs(defaultConfig, userConfig) {
  return {
    ipFiltering: {
      ...defaultConfig.ipFiltering,
      ...userConfig.ipFiltering
    },
    rateLimiting: {
      ...defaultConfig.rateLimiting,
      ...userConfig.rateLimiting
    },
    requestBlocking: {
      ...defaultConfig.requestBlocking,
      ...userConfig.requestBlocking
    },
    logging: {
      ...defaultConfig.logging,
      ...userConfig.logging
    },
    alerting: {
      ...defaultConfig.alerting,
      ...userConfig.alerting
    },
    general: {
      ...defaultConfig.general,
      ...userConfig.general
    }
  };
}

// Load and export the configuration
module.exports = loadConfig;
