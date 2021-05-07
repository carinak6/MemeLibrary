import React, {FunctionComponent, useState, useEffect, HtmlHTMLAttributes } from 'react';
import { Route, Switch } from 'react-router-dom';
import App from "./App";
import Nav from './components/navbar'
import LoginPage from './components/loginComponent'
import DashboardPage from './components/dashboardComponent'

export const Routes = () => {
  return (

    <div>
        <Nav/>
      <Switch>
        <Route exact path="/" component={App}/>
        <Route  path="/login" component={LoginPage}/>
        <Route  path="/dashboard" component={DashboardPage}/>
      </Switch>
    </div>
  );
};

