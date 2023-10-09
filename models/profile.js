const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    address_line_1: { type: String, required: true },
    address_line_2: { type: String, default: null },
    address_line_3: { type: String, default: null },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postal_code: { type: String, required: true },
    country: { type: String, required: true },
    latitutude: { type: String, default: '' },
    longitude: { type: String, default: '' }
}, {
    timestamps: true
});

const profileSchema = new Schema({
    user: {
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
    profile_pic: {type: String, default: "https://firebasestorage.googleapis.com/v0/b/wordofmouth-alpha.appspot.com/o/profile-pictures%2Fprofile-default.png?alt=media&token=ee3c6a06-eefa-4bed-8e4a-d0278c9f33fb&_gl=1*1ooivdz*_ga*MTAyODI4NzM3NC4xNjkwNTQyNTYy*_ga_CW55HF8NVT*MTY5NjY1MTM0NS42OS4xLjE2OTY2NTMwNzMuNjAuMC4w"},
    email: {type: String, default: "" },
    phone: {type: String, default: "" },
    gender: {
        type: String, 
        enum: ["unspecified", "male", "female", "non-binary"],
        default: "unspecified"
    },
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