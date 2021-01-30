import React, {useEffect} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import NavBar from "./components/layout/NavBar";
import Landing from './components/layout/Landing'
import {Routes} from './components/routing/Routes'
import {loadUser} from "./actions/auth"
import setAuthToken from './utils/setAuthToken'
import {Provider} from 'react-redux';
import store from './store'
import './App.css';

  if (localStorage.token) {
    setAuthToken(localStorage.token)
  }

function App() {
  useEffect(()=>{store.dispatch(loadUser())},[] )
  return (
    <Provider store={store}>
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route component={Routes} />
      </Switch>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
