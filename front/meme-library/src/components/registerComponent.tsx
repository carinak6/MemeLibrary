import React, {FunctionComponent, useState, useEffect, HtmlHTMLAttributes } from 'react';
import axios from 'axios'
import { url } from 'inspector';


type userLogin = {
    user:string,
    mail:string;
    password:string;

}


const RegisterPage = () => {
    const [{user, mail, password}, SetLoginUser] = useState<userLogin>({
        user: '',
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
        <input className="log-input" name="user" type="text" placeholder="Name" value={user} onChange={(e) => SetLoginUser({
            user: e.target.value,
            mail,
            password,
            
        })}/>
        </div>
    
        <div className="group">
        <input className="log-input" name="mail" type="mail" placeholder="Mail" value={mail} onChange={(e) => SetLoginUser({
            mail: e.target.value,
            password,
            user
        })}/>
        </div>

        <div className="group">
        <input type="password" name="password" className="log-input" placeholder="Password" value={password}  onChange={(e) => SetLoginUser({
            password: e.target.value,
            mail,
            user
        })}/>
        </div>

        <button className="user-btn" type="submit" onClick={login}>Login</button>
        </div>
    )
}

export default RegisterPage

