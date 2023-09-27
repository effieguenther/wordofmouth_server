const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        default: 'Pending'
    }
}, {
    timestamps: true
});

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;

//exports a constructor function which builds an instance of the model class