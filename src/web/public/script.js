document.getElementById('configForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const config = {
        ipFiltering: {
            enabled: document.getElementById('ipFilteringEnabled').checked,
            allowedIps: document.getElementById('allowedIps').value.split('\n').filter(ip => ip.trim() !== ''),
            blockedIps: document.getElementById('blockedIps').value.split('\n').filter(ip => ip.trim() !== ''),
            maxRequestsPerMinute: parseInt(document.getElementById('maxRequestsPerMinute').value, 10) || 0,
            banDuration: parseInt(document.getElementById('banDuration').value, 10) || 0
        },
        rateLimiting: {
            enabled: document.getElementById('rateLimitingEnabled').checked,
            maxRequests: parseInt(document.getElementById('maxRequests').value, 10) || 0,
            timeWindow: parseInt(document.getElementById('timeWindow').value, 10) || 0,
            banDuration: parseInt(document.getElementById('rateBanDuration').value, 10) || 0
        },
        requestBlocking: {
            enabled: document.getElementById('requestBlockingEnabled').checked,
            rules: JSON.parse(document.getElementById('rules').value || '[]') // Assumes rules are entered in JSON format
        },
        logging: {
            enabled: document.getElementById('loggingEnabled').checked,
            logLevel: document.getElementById('logLevel').value,
            logToFile: document.getElementById('logToFile').checked,
            logToConsole: document.getElementById('logToConsole').checked
        },
        alerting: {
            enabled: document.getElementById('alertingEnabled').checked,
            alertLevel: document.getElementById('alertLevel').value,
            email: document.getElementById('email').value,
            sms: document.getElementById('sms').value,
            alertThreshold: parseInt(document.getElementById('alertThreshold').value, 10) || 0
        },
        general: {
            blockOnBreach: document.getElementById('blockOnBreach').checked,
            maxRequestSize: parseInt(document.getElementById('maxRequestSize').value, 10) || 0,
            requestTimeout: parseInt(document.getElementById('requestTimeout').value, 10) || 0
        }
    };

    try {
        const response = await axios.post('/reqweb/api/config', config);
        alert(response.data.message || 'Configuration saved successfully!');
    } catch (error) {
        console.error('Error saving configuration:', error);
        alert('Failed to save configuration. Please try again.');
    }
});

// Dynamically fetch and populate form with existing configuration on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get('/reqweb/api/config');
        const config = response.data;

        // Populate IP Filtering
        document.getElementById('ipFilteringEnabled').checked = config.ipFiltering.enabled;
        document.getElementById('allowedIps').value = config.ipFiltering.allowedIps.join('\n');
        document.getElementById('blockedIps').value = config.ipFiltering.blockedIps.join('\n');
        document.getElementById('maxRequestsPerMinute').value = config.ipFiltering.maxRequestsPerMinute || '';
        document.getElementById('banDuration').value = config.ipFiltering.banDuration || '';

        // Populate Rate Limiting
        document.getElementById('rateLimitingEnabled').checked = config.rateLimiting.enabled;
        document.getElementById('maxRequests').value = config.rateLimiting.maxRequests || '';
        document.getElementById('timeWindow').value = config.rateLimiting.timeWindow || '';
        document.getElementById('rateBanDuration').value = config.rateLimiting.banDuration || '';

        // Populate Request Blocking
        document.getElementById('requestBlockingEnabled').checked = config.requestBlocking.enabled;
        document.getElementById('rules').value = JSON.stringify(config.requestBlocking.rules, null, 2);

        // Populate Logging
        document.getElementById('loggingEnabled').checked = config.logging.enabled;
        document.getElementById('logLevel').value = config.logging.logLevel;
        document.getElementById('logToFile').checked = config.logging.logToFile;
        document.getElementById('logToConsole').checked = config.logging.logToConsole;

        // Populate Alerting
        document.getElementById('alertingEnabled').checked = config.alerting.enabled;
        document.getElementById('alertLevel').value = config.alerting.alertLevel;
        document.getElementById('email').value = config.alerting.email;
        document.getElementById('sms').value = config.alerting.sms;
        document.getElementById('alertThreshold').value = config.alerting.alertThreshold || '';

        // Populate General
        document.getElementById('blockOnBreach').checked = config.general.blockOnBreach;
        document.getElementById('maxRequestSize').value = config.general.maxRequestSize || '';
        document.getElementById('requestTimeout').value = config.general.requestTimeout || '';
    } catch (error) {
        console.error('Error fetching configuration:', error);
        alert('Failed to load configuration. Please try again.');
    }
});
