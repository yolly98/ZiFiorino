import React, {Component} from 'react';
import '../style/Login.css'

class Login extends Component{

    render(){
        return(
            <div id="login-page">
                <label id="login-title">ZiFiorino</label>
                <label>Nome Utente</label>
                <input id="login-input-user" type="text" style={{marginBottom: '1rem'}}/>
                <label>Password</label>
                <input id="login-input-password" type="password" style={{marginBottom: '1rem'}}/>
                <button  
                    style={{borderRadius: '0.5rem', fontSize: '1.5rem', marginTop: '0.5rem'}} 
                    onClick={() => this.props.onLogin(document.getElementById('login-input-user').value, document.getElementById('login-input-password').value)}
                >
                        LOGIN
                </button>
                <button  
                    style={{borderRadius: '0.5rem', fontSize: '1.5rem', marginTop: '1.5rem'}} 
                    onClick={() => this.props.onSignup(document.getElementById('login-input-user').value, document.getElementById('login-input-password').value)}
                >
                    REGISTRATI
                </button>
            </div>
        );
    }
}

export default Login;