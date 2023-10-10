const cors = require('cors');

const whitelist = ['https://us-central1-wordofmouth-alpha.cloudfunctions.net', 'http://127.0.0.1:5001/wordofmouth-alpha/us-central1', 'http://localhost:3001'];
const corsOptionsDelegate = (req, callback) => {
    let corsOptions;
    console.log(req.header('Origin'), "line 8");

    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        console.log(req, "line 9");
        corsOptions = { origin: true };
    } else {
        corsOptions = { origin: false };
    }
    console.log(req.header('Authorization'));

    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);