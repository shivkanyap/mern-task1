const express=require('express')
const router=express.Router()
const {User}=require('../models/User')
const {RequestForm}=require('../models/RequestForm')
const { authenticateUser}=require('../middleware/authentication')
const _=require('lodash')

router.post('/create', authenticateUser,async(req,res)=>{
    const body=req.body
    const requestform=new RequestForm(body)
      // logic to check a user can't assign to a user of same department
    let foundUser=await User.findById(body.assignedUser)
    if(req.user.department.toString()!==foundUser.department.toString()){
    requestform.save()
    .then(requestform=>res.send(requestform))
    .catch(err=>res.send(err))
    }else{
        res.send({'error':'cannot request a user of the same department'})
    }
});

router.get('/view',authenticateUser,(req,res)=>{
    const user=req.user
    RequestForm.find().populate('assignedUser','username').populate('assignedDepartment','deptName').populate('createdBy','username')
    .then(requestform=>{
        let filteredForm=[]
        for (let i=0;i<requestform.length;i++){
           
            if(requestform[i].createdBy._id.toString()===user._id.toString() || user._id.toString()===requestform[i].assignedUser._id.toString() || ((requestform[i].assignedDepartment._id.toString()===user.department.toString()) && (requestform[i].status!=='approved')) ){
                filteredForm.push(requestform[i])
        }
        
    }
    res.send(filteredForm)
    })
    .catch(err=>{
        res.send(err)
    });
})

router.get('/view/pendingapproval',authenticateUser,(req,res)=>{
    const user=req.user
    RequestForm.find().populate('assignedUser','username').populate('assignedDepartment','deptName').populate('createdBy','username')
    .then(requestform=>{
        let filteredForm=[]
        for (let i=0;i<requestform.length;i++){
        if(requestform[i].assignedUser._id.toString()==user._id.toString() && requestform[i].status==='pending'){
            filteredForm.push(requestform[i])
             
        }
    }
    res.send(filteredForm)
})
.catch(err=>{
    res.send(err)
});
})

router.put('/edit/:id',authenticateUser,async (req,res)=>{
    const id=req.params.id
    const loggedinUser=req.user._id
    let form=await RequestForm.findById(id)
    if(!form){
        
        return res.send({error:'form doesnt exist'})
    }
    else{
        if(loggedinUser.toString()!== form.assignedUser.toString()){
            return res.send({error:'logged in user & assigned user must be samemo'})
        }else if (form.status!=='pending'){
            return res.send({error:'form must be in pending state to approve'})
        }
        else{
            const body=req.body
            RequestForm.findByIdAndUpdate({_id:id},body,{new:true,runValidators:true})
            .then(requestform=>{
                res.send(requestform)
            })
            .catch(err=>{
                res.send(err)
            });
        }
    }
            
});
module.exports={
    requestformRouter:router
}
