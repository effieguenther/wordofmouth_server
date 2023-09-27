const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    image:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    featured:{
        type:Boolean,
        required:true,
        default:false
    },
    sort_order: {
        type: Number,
        min: 1,
        required: true
    },
    sub_service: [serviceSchema]
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;