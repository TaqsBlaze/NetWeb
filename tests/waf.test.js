// test/waf.test.js
let chai;
let expect;
let request;
let ipFilter;
let configLoader;
let app;

before(async () => {
    // Dynamically import chai and other dependencies
    chai = (await import('chai'));
    expect = chai.expect;
    request = (await import('supertest'));
    ipFilter = (await import('../src/middlewares/ipFilter'));  // Adjust this to the correct path
    configLoader = (await import('../src/utils/configLoader'));  // Adjust path for your config loader

    // Load the configuration
    const config = configLoader.loadConfig('../src/config/defaultConfig.json');

    // Set up Express app and middleware
    app = express();
    app.use(ipFilter(config));

    // Test route
    app.get('/', (req, res) => {
        res.status(200).send('Hello, World!');
    });
});

describe('NetWeb WAF - IP Filtering', () => {
    it('should block requests from blocked IPs', (done) => {
        const blockedIP = '192.168.1.100';  // An IP from your blockedIPs list
        request(app)
            .get('/')
            .set('X-Forwarded-For', blockedIP)
            .expect(403)  // Expect a 403 Forbidden response
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.have.property('error', 'Access denied: Your IP is blocked.');
                done();
            });
    });

    it('should allow requests from allowed IPs', (done) => {
        const allowedIP = '127.0.0.1';  // An IP from your allowedIPs list
        request(app)
            .get('/')
            .set('X-Forwarded-For', allowedIP)
            .expect(200)  // Expect a 200 OK response
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal('Hello, World!');
                done();
            });
    });

    it('should return a 404 for undefined routes', (done) => {
        request(app)
            .get('/undefined')
            .expect(404)  // Expect a 404 Not Found response
            .end(done);
    });
});
