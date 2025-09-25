    const mongoose=require('mongoose');
    const clientSchema= new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        contact:{
            type:Number,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        company:{
            type:String,
            required:true
        }
    },{timestamps: true});
    const Client=mongoose.model('client',clientSchema);
    module.exports=Client;

