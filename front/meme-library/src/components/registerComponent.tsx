import React, {useState} from 'react';
import {Link } from 'react-router-dom';
import axios from 'axios'


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

    
    async function submit(e){

        e.preventDefault();
        try {
            //Ce sont les variables que mon back connait
            const data = {
                user,
                mail,
                password
            };

            //Requete post au back qui sera changé pour le lien Azure
            await axios.post("http://localhost:3500/api/add/user", data)

        } catch (err) {
            console.error(err) 
        }

    }

    return(

        <div className="formUser">
        <form method="post" onSubmit={submit}>
        <div className="group">
        <input className="log-input" name="name" type="text" placeholder="Name" value={user} onChange={(e) => SetLoginUser({
            user: e.target.value,
            mail,
            password, 
        })}/>
        </div>
        
        <div className="group">
        <input className="log-input" name="email" type="mail" placeholder="Mail" value={mail} onChange={(e) => SetLoginUser({
            mail: e.target.value,
            password,
            user
        })}/>
        </div>

        <div className="group">
        <input type="password" name="pwd" className="log-input" placeholder="Password" value={password}  onChange={(e) => SetLoginUser({
            password: e.target.value,
            mail,
            user
        })}/>
        </div>
        <button className="user-btn" type="submit" > Login </button>
        {/* <Link to="/dashboard"><button className="user-btn" type="submit" > Login</button></Link> */}

        </form>
        </div>
    
    )
}

export default RegisterPage

