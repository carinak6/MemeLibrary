import React, {FunctionComponent, useState, useEffect, HtmlHTMLAttributes } from 'react';
import axios from 'axios'
import { url } from 'inspector';


type userLogin = {
    mail:string;
    password:string;

}


const LoginPage = () => {
    const [{mail, password}, SetLoginUser] = useState<userLogin>({
        mail: '',
        password: '',

    })

    const  login = async () => {
        await axios({
            method: "POST",
            data: {
                userMail: mail,
                userPassword: password,
            
            },
            // withCredentials: true,
            url: 'http://localhost:4000/login'
        }).then((res) => console.log(res.data))
        // SetLoginUser("")
    }
    return(

        <div className="formUser">
    
        <div className="group">
        <input className="log-input" type="mail" placeholder="Mail" name="mail" value={mail} onChange={(e) => SetLoginUser({
            mail: e.target.value,
            password,
            
        })}/>
        </div>

        <div className="group">
        <input type="password" className="log-input" placeholder="Password" name="password" value={password}  onChange={(e) => SetLoginUser({
            password: e.target.value,
            mail,
            
        })}/>
        </div>

        <button className="user-btn" type="submit" onClick={login}>Login</button>
        </div>
    )
}

export default LoginPage



// import logo from './logo.svg';
// import './App.css';
// import { config } from './Config';
// import { PublicClientApplication } from '@azure/msal-browser';
// import { Component } from 'react';

// class App extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       error: null,
//       isAuthenticated: false,
//       user: {}
//     };
//     this.login = this.login.bind(this)
//     this.publicClientApplication = new PublicClientApplication({
//       auth: {
//         clientId: config.appId,
//         redirectUri: config.redirectUri,
//         authority:config.authority
//       },
//       cache: {
//         cacheLocation: "sessionStorage",
//         storeAuthStateInCookie: true
//       }
//     });
//   }


// async login() {
//   try {
//     await this.publicClientApplication.loginPopup(
//       {
//         scopes: config.scopes,
//         prompt: "select_account"
//       }
//     );
//     this.setState({isAuthenticated:true})
//   }
//   catch(err) {
//     this.setState({
//       isAuthenticated: false,
//       user: {},
//       error: err
//     });
//   }
// }

// logout() {
//   this.publicClientApplication.logout()
// }


// render(){
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         {this.state.isAuthenticated ? <p>
//           Successful logged in
//           </p> :
//           <p>
//           <button onClick={() => this.login()}>Login in</button>
//         </p>
// }
//       </header>
//     </div>
//   );
// }
// }

// export default App;
