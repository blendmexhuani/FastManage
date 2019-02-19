import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Redirect, withRouter } from "react-router-dom";
import { graphql } from 'react-apollo'
import  { gql } from 'apollo-boost';
import { AUTH_TOKEN } from '../constant';
import '../App.css';
  
class LoginForm extends Component {
    constructor() {
      super();
      this.state = {
        toApp: false,
        toRegister: false,
        email: '',
        password: '',
        loginError: false,
        userID: ''
      };

      this.handleRegister = this.handleRegister.bind(this);
    }

    handleRegister = () => {
      this.setState({toRegister: true})
    }

    login =(email, password)=> {
      this.props.loginMutation({
          variables: {
            email,
            password,
          },
        })
        .then(result => {
          const token = result.data.login.token;
          const userId = result.data.login.user.id;
          if (token) {
              localStorage.setItem('AUTH_TOKEN', token);
              localStorage.setItem('userID', userId);
          }
          this.setState({
            toApp: true,
            loginError: false,
            userID: userId
          })
        })
        .catch(err => {
          this.setState({
            loginError: true
          });
        })
    }

    render() {
      
      if(this.state.toApp == true){
        return <Redirect to={{
          pathname: '/',
          state: {userID: this.state.userID}}} />
      } 
      
      if(localStorage.userID){
        return <Redirect to={{
          pathname: '/',
          state: {userID: localStorage.userID}}} />
      }
      
      if(this.state.toRegister == true){
        return <Redirect to='/register' />
      }
  
      return (
            <Form className="login-form login">
              <Form.Item>
                  <Input value={this.state.email}
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                    placeholder="Email" 
                    onChange={(e)=> this.setState({email: e.target.value})} 
                   />
              </Form.Item>
              <Form.Item>
                  <Input  value={this.state.password} prefix={<Icon type="lock" 
                    style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password"
                    onChange={(e)=> this.setState({password: e.target.value})}  />
              </Form.Item>
              {this.state.loginError &&
                  <div>
                      <label style={{color: "#ff0000", marginBottom: "20px"}}>
                        Email or Password is incorrect!
                      </label><br /><br />
                  </div>
              }
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button" 
                  onClick={()=>this.login(this.state.email, this.state.password)}
                  style={{marginRight: "5px"}}>
                  Log in
                </Button>
                  Or <label style={{textDecoration: "underline", color: "#551A8B"}} onClick={this.handleRegister}>register now!</label>
              </Form.Item>
            </Form>
      );
    }
}
  const LOGIN_USER_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`

export default graphql(LOGIN_USER_MUTATION, { name: 'loginMutation' })(
  withRouter(LoginForm),
)