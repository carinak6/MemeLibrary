import axios from 'axios';
import React, {FunctionComponent, useState, useEffect, HtmlHTMLAttributes } from 'react';
import {Link} from 'react-router-dom'
import DisplayMeme from './components/displayMemeComponent'
import LoginPage from './components/loginComponent'
import './App.css';



function App() {

  return (
    <div className="App">
    
      <div>
        {/* <Route exact path='/' component={DisplayMeme}></Route> */}
        {/* <Route path='/login' component={LoginPage}></Route> */}

      {<DisplayMeme/>}
      </div>
    </div>

    
  );
}

export default App;
