const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    authentication_method: {
        type: Number,
        enum:["google", "email-password"],
        required: true
    },
    is_admin:{
        type:Boolean,
        required:true,
        default:false
    },
    is_worker:{
        type:Boolean,
        required:true,
        default:false
    },
    is_verified:{
        type:Boolean,
        required:true,
        default:false
    },
    status:{
        type:Boolean,
        enum: ["Active", "Inactive", "Dormant"],
        default: "Active",
        required:true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;