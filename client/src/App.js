import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';
//Redux
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import { loadUser } from './actions/auth';
import { LOGOUT } from './actions/type';
import setAuthToken from './utils/setAuthToken';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  // check for token in LS and load user
  if (localStorage.token) {
    setAuthToken(localStorage.token);
    store.dispatch(loadUser());
  }

  // log user out from all tabs if they logged out in one tab or the token expires
  window.addEventListener('storage', () => {
    if (!localStorage.token) store.dispatch({ type: LOGOUT });
  });
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
