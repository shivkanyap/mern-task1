const mongoose=require('mongoose')
const Schema=mongoose.Schema
const requestFormSchema=new Schema({
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
        
    },
    assignedDepartment:{
        type:Schema.Types.ObjectId,
        ref:'Department',
        required:true
    },
    assignedUser:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    message:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'pending'
    }
 
})

const RequestForm = mongoose.model('RequestForm', requestFormSchema);
module.exports={
    RequestForm
}