const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    to_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    from_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
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