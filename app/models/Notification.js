const mongoose=require('mongoose')
const Schema=mongoose.Schema

const notificationSchema=new Schema({
    msg:{
        type:String,
        required:true     
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})

const Notification = mongoose.model('Notification', notificationSchema);
module.exports={
    Notification
}