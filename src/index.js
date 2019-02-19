import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import App from './App';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import * as serviceWorker from './serviceWorker';
import { ApolloProvider } from 'react-apollo';
import client from './apollo';
import { AUTH_TOKEN } from './constant';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem('AUTH_TOKEN');
  const userID = localStorage.getItem('userID');
  return token ? (<Route {...rest} render={matchProps => <Component userID={userID} {...matchProps} />}/> ) : (<Redirect to="/login" />)
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
        <Switch>
          <Route exact path="/login" render={props => <LoginForm {...props} />} />
          <Route exact path="/register" render={props => <RegisterForm {...props} />} />
          <ProtectedRoute exact path="/" component={App} />
          <ProtectedRoute exact  path="/Home" component={App} />} />
          <ProtectedRoute exact  path="/AddProduct" component={App}  />
          <ProtectedRoute exact  path="/FlashDeals" component={App} />
          <ProtectedRoute exact  path="/MyProducts" component={App} />
        </Switch>
      </BrowserRouter>
  </ApolloProvider>,
    document.getElementById('root')
);

serviceWorker.unregister();
if (module.hot) module.hot.accept();