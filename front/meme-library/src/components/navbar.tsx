import { BrowserRouter as Router, Link } from 'react-router-dom';
import AuthService from '../auth.service';

const Nav = ()=> {
    const currentUser = AuthService.getCurrentUser()
    const logOut = () => {
        AuthService.logout()
        window.location.reload()
    }

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
        { currentUser && (
    <Link to="/dashboard"><button className="user-btn">
        Dashboard
        </button>
    </Link>
)}

{ currentUser ? (
    <Link to="/login"><button onClick={logOut} className="user-btn">
        LogOut</button>
        </Link>
): ( <Link to="/login"><button className="user-btn" id="Login">
            Login
        </button>
    </Link>)}
    </div>

  </header> 
        </div>
    )
}

export default Nav