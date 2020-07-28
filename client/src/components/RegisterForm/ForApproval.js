import React from 'react'
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MsgWindow from '../MsgWindow/MsgWindow' 

class ForApproval extends React.Component
{
    constructor(props) {
        super(props)
        this.state={
            pendingApprovalForms:[],
            approval:{}
        }
    }
    componentDidMount(){
        axios.get('/requestform/view/pendingapproval',{
            headers:{
                'x-auth':localStorage.getItem('token')
            }
        })
        .then(response=>{
            this.setState(()=>({
                pendingApprovalForms:response.data
            }))
        })
    }
    handleApprove = (_id,username,userid) => {
        
        const confirm = window.confirm("Are you sure?")
        if(confirm){
            const id = _id
            const updateData={
                status:"approved"
            }
            let msgData = {
                msg: `form approved by ${username} `,
                userid:userid
            };
            axios.put(`/requestform/edit/${id}`,updateData, {
                headers: {
                    'x-auth' : localStorage.getItem('token')
                }
            })
            .then(response =>{
               
                if ((response.data.status = "approved")) {
                    this.setState({ approval: response.data });
                    setTimeout(() => {
                      this.props.history.push("/requestform/approved");
                    }, 5000);
                  }
                  // post api call to notification id & msg
            });
            axios.post(`/notification/create`, msgData, {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            });   
           
        }
    }

    handleReject = (_id,username,userid) => {
        const confirm = window.confirm("Are you sure?")
        if(confirm) {
            const id = _id
            const updateData={
                status:"rejected"
            }
            let msgData = {
                msg: `form rejected by ${username} `,
                userid:userid
              };
            axios.put(`/requestform/edit/${id}`,updateData, {
                headers: {
                    'x-auth' : localStorage.getItem('token')
                }
            })
            .then(response => {
             
                if((response.data.status = "rejected")) {
                    this.setState({ approval: response.data });
                    setTimeout(() => {
                        this.props.history.push("/requestform/rejected");
                    }, 5000);
                }
                  // post api call to notification id & msg
            });
            axios.post(`/notification/create`, msgData, {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            });   
        }
    }
    
    notify = () => {
        toast.success("Request Sent Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };
    notify = () => {
        toast.success("Approved Sent Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    };
    notifyReject = () => {
        toast.success("Reject Sent Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    };
    
    render()
    {
       
        return(
            <div>
                <h1> For Approval Forms List </h1>  
                   
        <table border="2">
        <thead>
            <tr  className="actiontext"> 
                <th> Created By </th>  
                <th> Assigned Dept </th>
                <th> Asigned User </th>
                <th> Message </th>
                <th> Status </th> 
                <th>Action</th>
            </tr>
        </thead>
      
        <tbody className="actiontext">
        {
          this.state.pendingApprovalForms.map(form =>{
            return (
                <>
    
              <tr key ={form._id} className="actiontext">
              
                <td> { form.createdBy.username } </td>
                <td> { form.assignedDepartment.deptName } </td>
                <td> { form.assignedUser.username  }</td>
                <td> { form.message }</td>
                <td> { form.status } </td>
               
                <td>  
                    <ToastContainer />
                    <button className="btn btn-primary btn-sm pd-1 mr-2" onClick={()=>this.handleApprove(form._id,form.assignedUser.username,form.assignedUser._id)}>Approve</button>
                    <button  className="btn btn-danger btn-sm pd-1 ml-2" onClick={()=>{this.handleReject(form._id,form.assignedUser.username,form.assignedUser._id ); return this.notifyReject();}}>Reject</button>
                </td>

               </tr>
               </>
            )
          })
        }
        </tbody>
        
        </table>
        {this.state.approval.status === "approved" ? this.notify() : null}
      
        <MsgWindow/>
        </div>

        )
        
    }
}
export default ForApproval