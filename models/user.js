const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');//import passport-local-mongoose

const userSchema = new Schema({
    authentication_method: {
        type: String,
        enum:["google", "username-password"],
        //effie: on the front-end we will require either a phone number or email to be added to the profile for password recovery
        default: "username-password",
        required: true
    },
    is_admin:{
        type:Boolean,
        required:true,
        default:false
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

userSchema.plugin(passportLocalMongoose, { usernameCaseInsensitive: true });

module.exports = mongoose.model('User', userSchema);