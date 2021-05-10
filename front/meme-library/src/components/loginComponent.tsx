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

    async function login(e){

        e.preventDefault();
        try {
            //Ce sont les variables que mon back connait
            const data = {
                mail,
                password
            };

            //Requete post au back qui sera changé pour le lien Azure
            await axios.post("http://localhost:3500/api/login", data)

        } catch (err) {
            console.error(err) 
        }

    }


    return(

        <div className="formUser">
        <form onSubmit={login}>
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
        <div>
        <button className="user-btn" type="submit" onClick={login}>Login</button>
        </div>
        </form>
        
        </div>
    )
}

export default LoginPage

