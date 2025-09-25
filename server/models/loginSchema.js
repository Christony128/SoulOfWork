const mongoose=require('mongoose');
const loginSchema=new mongoose.Schema({
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},{timestamps: true});
const Logins=mongoose.model('login',loginSchema);
module.exports= Logins;