import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Redirect, withRouter } from "react-router-dom";
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost'
import '../App.css';
  
class RegisterForm extends Component {
    constructor() {
      super();
      this.state = {
        toLogin: false,
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        loginError: false,
        loginErrorPassword: false
      };

      this.handlePassword = this.handlePassword.bind(this);
      this.comparePasswords = this.comparePasswords.bind(this);
    }

    handlePassword(event) {
      this.setState({password: event.target.value});
    }
    
    comparePasswords = () => {
      if(this.state.password != this.state.confirmPassword){
        this.setState({loginErrorPassword: true});
      } else {
        this.setState({loginErrorPassword: false});
      }
    }

    handleRegister = (data) => {
      const {email, username, password} = data;
      
      const result = this.props.signupMutation({
        variables: {
          email,
          password,
          username
        },
      }).then(result => {
        this.setState({
          toLogin: true
        })
      })
      .catch(err => {
        this.setState({
          loginError: true
        });
      })
    }
  
    render() {
        
      if(this.state.toLogin == true){
        return <Redirect to='/login' />
      }

      if(localStorage.userID){
        return <Redirect to={{
          pathname: '/',
          state: {userID: localStorage.userID}}} />
      }

      return (
        <Form onSubmit={this.handleSubmit} className="login-form register">
          <Form.Item label="Username">
              <Input 
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                placeholder="Username"
                onChange={(event) => this.setState({username: event.target.value})}
                value={this.state.username} />
          </Form.Item>
          <Form.Item label="Email">
              <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
              placeholder="Email"
              onChange={(event) => this.setState({email: event.target.value})}
              value={this.state.email} />
          </Form.Item>          
          <Form.Item label="Password">
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                type="password" 
                placeholder="Password" 
                onChange={(event) => this.setState({password: event.target.value})}
                value={this.state.password} />
          </Form.Item>          
          <Form.Item label="Confirm Password">
              <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                type="password" 
                placeholder="Confirm Password" 
                onChange={(event) => this.setState({confirmPassword: event.target.value})} onBlur={this.comparePasswords}
                value={this.state.confirmPassword} />
          </Form.Item>
          {this.state.loginErrorPassword && 
                  <div>
                      <label style={{color: "#ff0000", marginBottom: "20px"}}>
                        Passwords do not match!
                      </label><br /><br />
                  </div>
          }
          {this.state.loginError && 
                  <div>
                      <label style={{color: "#ff0000", marginBottom: "20px"}}>
                        Please fill out the form!
                      </label><br /><br />
                  </div>
          }        
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" 
              onClick={() => this.handleRegister(this.state)}
              style={{marginRight: "5px"}}>
              Register
            </Button><br />
              Already an account? <label style={{textDecoration: "underline", color: "#551A8B"}} onClick={()=>this.setState({toLogin: true})}>Sign In!</label>
          </Form.Item>
        </Form>
      );
    }
}

const SIGNUP_USER_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $username: String!) {
    signup(email: $email, password: $password, username: $username) {
      token
      user {
        id
        username
        email
      }
    }
  }
`

export default graphql(SIGNUP_USER_MUTATION, { name: 'signupMutation' })(
  withRouter(RegisterForm),
)