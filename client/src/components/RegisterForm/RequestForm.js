import React from 'react'
import axios from 'axios'
import  './form.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MsgWindow from '../MsgWindow/MsgWindow' 

class RequestForm extends React.Component
{
    constructor(props) {
        super(props)
        this.state={
        createdBy:'',
        department:'',
        departmentArray:[],
        userArray:[],
        user:'',
        message:'',
        loggedInUser:{},
        error:false
        }
    }
    errMessage=()=>{
        if(
            this.state.createdBy ==="" &&
            this.state.department === "" &&
            this.state.user === "" &&
            this.state.message === ""
        ){

            this.setState({error:true})
        }
    }
    componentDidMount(){
        axios.get('/department/allDepartments',{
            headers:{
                'x-auth':localStorage.getItem('token')
            }
        })

        .then((response)=>{
            this.setState(()=>({
                departmentArray:response.data
              
            }))
        })

        axios.get('/users/allUsers',{
            headers:{
                'x-auth':localStorage.getItem('token')
            }
        })

        .then((response)=>{
            this.setState(()=>({
                userArray:response.data
              
            }))
        })
        axios.get('/users/loggedinuser',{
            headers:{
                'x-auth':localStorage.getItem('token')
            }
        })

        .then((response)=>{
            this.setState(()=>({
            loggedInUser:response.data
            
        }))
    })
    }
    handleChange=(e)=>{
        e.persist()
        this.setState(()=>({
          [e.target.name] : e.target.value   
        }))
    }
    handleSubmit=(e)=>{
        e.preventDefault() 
        const formData={
            createdBy : this.state.createdBy,
            assignedDepartment : this.state.department,
            assignedUser : this.state.user,
            message : this.state.message
        }
        let msgData = {
            msg: `form created by ${this.state.loggedInUser.username}`,
            userid:this.state.loggedInUser._id
        };
        axios.post(`/requestform/create`,formData,{
        
            headers:{
                'x-auth':localStorage.getItem('token')

            }
        })
        .then(response => {
            
            
            if (response.data.status === "pending")
            {
                setTimeout(() => {
                    this.props.history.push("/requestform/pending");
                 }, 5000);
            }
            axios.post(`/notification/create`, msgData, {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            })
            this.setState(()=>({
                createdBy:'',
                department:'',
                user:'',
                message:''
            }))
        })

        
    }
    notify = () => {
        toast.success("Request Sent Successfully", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
        this.setState({error:false})
        
      };
    render() {
    
        return(

            <fieldset>
              
                <h2 className="formheader">Form </h2>
                <ToastContainer />
                <div className="form-group col-md-8">
                {this.state.error?(<div style={{color:'red' ,textAlign:'center'}}>All fields are required</div>):null}
                <Form onSubmit={this.handleSubmit} className="formcenter">
                <div>
                    <div>
                        <FormGroup row>
                            <Label sm={2}className="headerlabel">
                                Username : <br/><span className="bracketsize">(Created By)</span>
                            </Label>
                            <Col sm={10}>
                                <Input name="createdBy" type="select" value={this.state.createdBy} onChange={this.handleChange} className="form-control">
                                        <option value="" >Select</option>
                                        <option value={this.state.loggedInUser._id} >{this.state.loggedInUser.username}</option>
                                    </Input>
                            </Col>
                        </FormGroup>
                    </div>
                        <div>
                            <FormGroup row>
                                <Label sm={2} className="headerlabel">
                                    Department : <br/><span className="bracketsize">(Assign To)</span>
                                </Label>
                                <Col sm={10}>
                                    <Input name="department" type="select" value={this.state.department} onChange={this.handleChange} className="form-control">
                                        <option value="" >Select</option>
                                        {this.state.departmentArray.filter(((department)=>department._id!==this.state.loggedInUser.department)).map((department)=>{
                                        return <option key={department._id}
                                        value={department._id}>{department.deptName}</option>
                                    })}
                                    </Input>
                                </Col>
                            </FormGroup>
                        </div>
                        <div>
                            <FormGroup row>
                                <Label sm={2} className="headerlabel">
                                    User : <br/><span className="bracketsize">(Assign To)</span>
                                </Label>
                                    <Col sm={10}>
                                        <Input name="user" type="select"  value={this.state.user}   onChange={this.handleChange} className="form-control">
                                            <option value="">Select</option>
                                            {this.state.userArray.filter(((user)=>user.department===this.state.department)).map((user)=>{
                                            return <option key={user._id}
                                            value={user._id}>{user.username}</option>
                                        })}
                                        </Input>
                                    </Col>
                            </FormGroup>
                        </div>
                    <div>
                        <FormGroup row>
                            <Label sm={2} className="headerlabel">
                                Message :
                            </Label>
                            <Col sm={10}>
                                <Input type="textarea" rows="3" cols="34" value={this.state.message} onChange={this.handleChange} name ="message">
                                </Input>
                            </Col>
                        </FormGroup>
                    </div>
                    
                        <Button type="submit" color="primary" size="sm"
                        onClick={
                            this.state.createdBy !== "" &&
                            this.state.department !== "" &&
                            this.state.user !== "" &&
                            this.state.message !== ""
                            ? this.notify
                            :this.errMessage
                        }>
                        Submit
                        </Button>
                    <div className="form-group col-md-4"></div>
                </div>
                </Form>           
            </div>  
            <MsgWindow/> 
            </fieldset>
        )
    }
}
export default RequestForm