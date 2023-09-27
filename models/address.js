const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    latitude: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
        required: true
    }
});

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;

//exports a constructor function which builds an instance of the model class