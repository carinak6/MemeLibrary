import React, {FunctionComponent, useState, useEffect, HtmlHTMLAttributes } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { Routes } from '../Route'; 

const Nav = ()=> {
    return (
        <div>

    <header className="Memes-header">
    <div id="title">
    <h1>Meme Library</h1>
    </div>
    
    <div className="btn">
    <Link to="/"><button className="user-btn" id="home">
            Home
        </button></Link>
        <Link to="/Register"><button className="user-btn" id="register">
            Register
        </button> 
    </Link>
        <Link to="/login"><button className="user-btn" id="Login">
            Login
        </button>
        </Link>
        <Link to="/dashboard"><button className="user-btn" id="dashboard">
            My Meme
        </button> 
    </Link>

    
        {/* <button className="user-btn" id="login">
            Login
        </button> */}
    </div>

  </header> 
        </div>
    )
}

export default Nav