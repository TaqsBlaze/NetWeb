![ReqWeb Logo](https://raw.githubusercontent.com/TaqsBlaze/ReqWeb/refs/heads/main/src/logo/logo.webp)
---

# **ReqWeb - Web Application Firewall (WAF)**

**ReqWeb** is a lightweight and customizable **Web Application Firewall (WAF)** for Node.js. It provides IP-based filtering, request rate limiting, and logging, helping to protect your web applications from malicious traffic and unauthorized access.

## **Features**
- **IP Filtering**: Block or allow specific IPs or CIDR ranges.
- **Rate Limiting**: Control the frequency of requests to prevent abuse.
- **Request Blocking**: Define custom rules to block unwanted requests.
- **Logging**: Detailed request logging to monitor security events.
- **Easy Integration**: Drop-in middleware for Express.js or any Node.js application.

## **Installation**

To install **ReqWeb**, simply run the following command:

```bash
npm install reqweb
```

## **Usage**

### Basic Setup with Express.js

1. **Import the package**:
   First, require **ReqWeb** in your application:

   ```javascript
   
    const express = require('express');
    const ipFilter = require('reqweb/src/middlewares/ipFilter');
    const ruleEngine = require('reqweb/src/middlewares/ruleEngine');
    const logger = require('reqweb/src/middlewares/logger');

   ```

2. **Load Configuration**:
   **ReqWeb** allows you to customize your configuration by loading a `userConfig.json` file. Here’s an example of how to load it:

   ```javascript
   const config = configLoader('reqweb/src/config/usertConfig.json'); //user defined rules and configs
   ```
   **Using default config**
   ```javascript
   const config = configLoader('reqweb/src/config/defaultConfig.json');
   ```
   
3. **Apply the Middleware**:
   Add the IP filtering middleware to your Express app:

   ```javascript
   const app = express();

   // Apply IP filtering middleware
   app.use(ipFilter(config));

   app.get('/', (req, res) => {
       res.send('Welcome to Homelab!');
   });

   app.listen(3000, () => {
       console.log('Homelab is running on http://localhost:3000');
   });
   ```

### Configuration Example

In the `userConfig.json` file, you can define the list of blocked and allowed IPs:

```json
{
  "blockedIPs": ["192.168.1.100", "203.0.113.0/24"],
  "allowedIPs": ["127.0.0.1", "::1"]
}
```

### Customizing the Middleware

You can modify or extend the behavior of **ReqWeb** by tweaking the `ipFilter.js` middleware or adding your own custom rules.

---

## **Configuration Options**

- **blockedIPs**: Array of IP addresses or CIDR ranges to block (e.g., `["192.168.1.100", "203.0.113.0/24"]`).
- **allowedIPs**: (Optional) Array of IP addresses or CIDR ranges that are allowed even if the `blockedIPs` list would block them (e.g., `["127.0.0.1", "::1"]`).

## **Advanced Features**

- **Rate Limiting**: Set up rate limiting to avoid abusive requests.
- **Logging**: Enable logging using **winston** for better monitoring of requests and events.
  
### Example of rate-limiting setup:

You can extend **ReqWeb** to add rate-limiting by combining it with other libraries like **express-rate-limit**.

---

## **Development & Testing**

### Run Tests
To run tests, use **Mocha** and **Chai** for testing:

```bash
npm test
```

### Build the Package
If you're using TypeScript or want to transpile code, you can build the project like this:

```bash
npm run build
```

---

## **Contributing**

Contributions are welcome! If you have suggestions, bug fixes, or improvements, feel free to submit a pull request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Create a new pull request.

---

## **License**

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---
