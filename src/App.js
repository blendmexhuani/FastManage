import React, { Component } from 'react';
import { Layout, Menu, Icon, Spin } from 'antd';
import './App.css';
import ListProducts from './components/ListProducts';
import AddProduct from './components/AddProduct';
import FlashDeals from './components/FlashDeals';
import MyProducts from './components/MyProducts';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { withRouter, Route, Link } from "react-router-dom";


const {
  Header, Content, Footer, Sider
} = Layout;


class App extends Component {

  state = {
    current: '1',
  }

  handleClickMenu = (e) => {
    this.setState({
      current: e,
    });
  }

  render() {

    const helloUser = {
      position: "absolute",
      bottom: "40px",
      fontSize: "15px",
      paddingLeft: "10%"
    }
    const logOut = {
      position: "absolute",
      bottom: "25px",
      fontSize: "15px",
      paddingLeft: "10%"
    }

    if(!this.props.data)
      return <div style={{textAlign: "center", paddingTop: "20%" }}><Spin size="large" /></div>

    if(this.props.data.loading)
      return <div style={{textAlign: "center", paddingTop: "20%" }}><Spin size="large" /></div>

    return (
        <Layout>
            <Sider style={{ height: '100vh', position: 'fixed', right: 0, }}>
              <div className="logo" style={{padding: "10px"}}>
                <h2 className="appLogo" onClick={()=>this.handleClickMenu('1')}>
                  <Link to="/"><i>Fast<b>Manage</b></i></Link>
                </h2>
                <hr />
              </div>
              <Menu theme="dark" mode="inline" selectedKeys={[this.state.current]}>
                  <Menu.Item key="1">
                    <Icon type="shop" />
                    <span className="nav-text" onClick={()=>this.handleClickMenu('1')}><Link to="/Home">Home</Link></span>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Icon type="appstore-o" />
                    <span className="nav-text" onClick={()=>this.handleClickMenu('2')}><Link to="/AddProduct">Add Product</Link></span>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Icon type="fall" />
                    <span className="nav-text" onClick={()=>this.handleClickMenu('3')}><Link to="/FlashDeals">Flash Deals</Link></span>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <Icon type="home" />
                    <span className="nav-text" onClick={()=>this.handleClickMenu('4')}><Link to="/MyProducts">My Products</Link></span>
                  </Menu.Item>
                  <span style={helloUser}><Icon type="user" /> Hello {this.props.data.user ? 
                    this.props.data.user.username: ""}</span>
                  <span style={logOut} onClick={()=>{
                    localStorage.removeItem('AUTH_TOKEN');
                    localStorage.removeItem('userID')}}>
                  <Link to="/login">Logout!</Link></span>
              </Menu>
            </Sider>
            <Layout style={{ marginRight: 200 }}>
              <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                <div style={{ padding: 18, background: '#fff', textAlign: 'left' }}>

                <Route exact path="/" render={(props) => <ListProducts userID={this.props.userID} {...props} />} />
                <Route exact path="/Home" render={(props) => <ListProducts userID={this.props.userID} {...props} />} />
                <Route exact path="/AddProduct" render={(props) => <AddProduct userID={this.props.userID} {...props} />} />
                <Route exact path="/FlashDeals" render={(props) => <FlashDeals userID={this.props.userID} {...props} />} />
                <Route exact path="/MyProducts" render={(props) => <MyProducts userID={this.props.userID} {...props} />} />
                  
                </div>
              </Content>
              <Footer style={{ textAlign: 'center', padding: "2px", marginTop: "5px"}}>
                <h4>Fast<b>Manage</b> © 2019. All rights reserved.</h4>
              </Footer>
            </Layout>
        </Layout>
    );
  }
}

const user = gql`
  query user($id: ID){
      user(id: $id){
        id
        username
        email
      }
  }
`

export default graphql(user, {options: (props) => ({variables: {id: props.userID}})})(
    withRouter(App),
  )