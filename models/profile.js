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
    address: addressSchema,
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
    images: [{ type: String }],
    profile_pic: String,
    phone: String
}, {
    timestamps: true
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;