const cors = require('cors');

const whitelist = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://localhost:3443'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        console.log(req);
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);