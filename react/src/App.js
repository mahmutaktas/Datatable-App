import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Login from './Login';
import Dashboard from './Dashboard';

function App() {
 


return (
  <div className="App">
    <BrowserRouter>
      <div>
        <div className="content">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/dashboard/" component={Dashboard} />
            <Route component={Error} />

           
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  </div>
);
}
 
export default App;