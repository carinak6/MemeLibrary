import { BrowserRouter as Router, NavLink } from "react-router-dom";
import AuthService from "../auth.service";

const Nav = () => {
    const currentUser = AuthService.getCurrentUser();
    const logOut = () => {
        AuthService.logout();
        window.location.href = "/";
    };

    return (
        <div>
            <header className='Memes-header'>
                <div id='title'>
                    <h1>Meme Library</h1>
                </div>

                <div className='btn'>
                    <NavLink exact activeClassName='active' to='/'>
                        <button className='user-btn' id='home'>
                            Home
                        </button>
                    </NavLink>
                    <NavLink activeClassName='active' to='/Register'>
                        <button className='user-btn' id='register'>
                            Register
                        </button>
                    </NavLink>
                    {currentUser && (
                        <NavLink activeClassName='active' to='/dashboard'>
                            <button className='user-btn'>Dashboard</button>
                        </NavLink>
                    )}

                    {currentUser ? (
                        <NavLink activeClassName='active' to='/login'>
                            <button onClick={logOut} className='user-btn'>
                                LogOut
                            </button>
                        </NavLink>
                    ) : (
                        <NavLink activeClassName='active' to='/login'>
                            <button className='user-btn' id='Login'>
                                Login
                            </button>
                        </NavLink>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Nav;
