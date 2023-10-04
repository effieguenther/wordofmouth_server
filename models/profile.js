const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    address_line_1: String,
    address_line_2: String,
    street: String,
    city: String,
    country_code: String,
    latitutude: String,
    longitude: String,
}, {
    timestamps: true
});

const profileSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    first_name: {
        type: String,
        required: true,
        default:""
    },
    last_name: {
        type: String,
        required: true,
        default:""
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
    address: addressSchema,
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
    images: [{ type: String }],
    profile_pic: {type: String, default: ''},
    phone: {type: String},
    gender: {type: String, default: 'unspecified'},
    status:{
        type:String,
        enum: ["Active", "Inactive", "Dormant"],
        default: "Active",
        required:true
    }

}, {
    timestamps: true
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;