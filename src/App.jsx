import React, { useEffect, useState } from 'react';

// REDUX
import { useDispatch } from 'react-redux';
import * as authActions from './store/actions/auth';

// FIREBASE
import { auth } from './firebase/config';

// REACT ROUTER
import { Switch, Route, Redirect } from 'react-router-dom';

// PAGES
import Layout from './layouts/Layout';
import Login from './containers/Auth/Login/Login';
import Signup from './containers/Auth/Signup/Signup';
import Home from './containers/Home/Home';
import Sites from './containers/Sites/Sites';
import EditSite from './containers/EditSite/EditSite';
import Users from './containers/Users/Users';
import Account from './containers/Account/Account';
import UserInfo from './containers/UserInfo/UserInfo';


function App() {
  const [authenticated, setAuthenticated] = useState(null)
  let routes;
  const dispatch = useDispatch()

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        dispatch(authActions.pushInfo(user))
        setAuthenticated(true)
      } else {
        setAuthenticated(false)
      }
    });
  })

  if (authenticated) {
    routes = (
      <Layout>
        <Switch>
          <Route exact path="/home" component={Home} />
          <Route exact path="/sites" component={Sites} />
          <Route exact path="/sites/:id" component={EditSite} />
          <Route exact path="/users" component={Users} />
          <Route exact path="/users/:id" component={UserInfo} />
          <Route exact path="/account" component={Account} />
          <Redirect to="/home" />
        </Switch>
      </Layout>

    )
  } else if (authenticated === false) {
    routes = (
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Redirect to="/login" />
      </Switch>
    )
  }


  return (
    <React.Fragment>
      {routes}
    </React.Fragment>

  );
}

export default App;
