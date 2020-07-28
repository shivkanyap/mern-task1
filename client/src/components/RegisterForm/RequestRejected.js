import React from 'react'
import axios from 'axios'
import MsgWindow from '../MsgWindow/MsgWindow' 

class RequestRejected extends React.Component
{
    constructor() {
        super()
        this.state={
            rejectedForms:[]

        }
    }

    componentDidMount(){
        axios.get('http://localhost:3005/requestform/view',{
            headers:{
                'x-auth':localStorage.getItem('token')
            }
        })
        .then(response=>{
            this.setState(()=>({
                rejectedForms:response.data
            }))
        })
    }
    render()
    {
        
        return(
          <div>
                <h1> Rejected Forms </h1>
                
            <table border="2">
            <thead>
              <tr> 
                <th> Created By </th>  
                <th> Assigned Dept </th>
                <th> Asigned User </th>
                <th> Message </th>
                <th> Status </th> 
              </tr>
            </thead>

            <tbody>
            {
              this.state.rejectedForms.filter(((reqForm)=>reqForm.status==='rejected')).slice(0,5).map(form =>{
                return (
                  <tr key ={form._id} className="actiontext">
                    <td> { form.createdBy.username } </td>
                    <td> { form.assignedDepartment.deptName } </td>
                    <td> { form.assignedUser.username  }</td>
                    <td> { form.message }</td>
                    <td> { form.status }</td>
                  </tr>

                )
              })
            }
            </tbody>
            </table>
            <MsgWindow/>
          </div>

        )
        
    }
}
export default RequestRejected