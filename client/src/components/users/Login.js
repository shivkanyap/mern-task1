import React from 'react';
import axios from 'axios';
// import form from './../RegisterForm/form.css';
import { Col, Button, Form, FormGroup, Label, Input } from 'reactstrap';

class Login extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            email: '',
            password: '',
            errors: ''
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
            email: this.state.email,
            password: this.state.password
        }

    axios.post('http://localhost:3005/users/login', formData)
    .then(response => {
        if (response.data.errors) {
            this.setState(() => ({
            errors: response.data.errors,
            password: ''
            }))
        } else {
                // write this to localStorage 
                localStorage.setItem('token', response.data.token)
                // redirect to notes page 
                this.props.history.push('/requestform/view')
                // change the navigation links = update the state of isAuthenticated in the parent component
                this.props.handleAuthentication(true)
            }
        })
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name]: e.target.value
        }))
    }

    render() {
         return (
            <div>
                <div className="formheader col-md-6">
                    <h2>Login </h2>
                    <Form onSubmit={this.handleSubmit}>
                        { this.state.errors && <p className="formcenter">{ this.state.errors}</p> }
                        <div>
                            <FormGroup row>
                                <Label sm={2} className="headerlabel">Email :</Label>
   
                                <Col sm={10}>
                                    <Input 
                                    type="text"
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    className="form-control"
                                    placeholder="Enter email">
                                    </Input>
                                </Col>
                            </FormGroup>
                        </div>
                        <div>
                            <FormGroup row>
                                <Label sm={2} className="headerlabel">Password:</Label>
                                    <Col sm={10}>
                                        <Input 
                                        type="password"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.handleChange}
                                        className="form-control"
                                        placeholder="your password">
                                        </Input>
                                    </Col>
                            </FormGroup>
                        </div>
                        <Button color="primary">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Login