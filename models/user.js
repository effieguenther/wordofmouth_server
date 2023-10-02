const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');//import passport-local-mongoose
const Schema = mongoose.Schema;

const userSchema = new Schema({
    authentication_method: {
        type: String,
        enum:["google", "email-password"],
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
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);