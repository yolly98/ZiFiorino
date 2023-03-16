import React, {Component} from 'react';
import '../style/desktop/Signup.css';
import '../style/mobile/Signup.css';

import cross from '../../images/delete.png';
import logo from '../../images/logo.png';
import showPassw from '../../images/showPassw.png';

class signup extends Component{

    state = {}

    showPassw(index){

        let passw = document.getElementsByClassName("signup-input")[index];
        if(passw.type == 'text')
            passw.type = 'password';
        else
            passw.type = 'text';
    }

    render(){
        return(
            <div id="signup-section">
                <div id="signup-container">
                    <div id="signup-container1">
                        <label id="signup-title">Registrati</label>
                        <img id="signup-cross" style={{width: '1.5rem', cursor: 'pointer'}} onClick={() => this.props.onCancel()} src={cross}/>
                    </div>
                    <div id="signup-container2">
                        <img id="signup-image" src={logo}/>
                        <div id="signup-container2-1">
                            <label className="signup-label">Inserisci Username</label>
                            <input className="signup-input" id="signup-input-username" type='text'></input>
                            <label className="signup-label">Inserisci Password</label>
                            <div className="signup-passwContainer">
                                <input className="signup-input" id="signup-input-passw" type='password'></input>
                                <img className="signup-showPassw" src={showPassw} onClick={() => this.showPassw(1)}></img>
                            </div>
                            <label className="signup-label">Ripeti Password</label>
                            <div className="signup-passwContainer">
                                <input className="signup-input" id="signup-input-rpassw" type='password'></input>
                                <img className="signup-showPassw" src={showPassw} onClick={() => this.showPassw(2)}></img>
                            </div>
                        </div>
                    </div>
                    <div id="signup-container3" style={{display: this.state.confirmationDisplay}}>
                        <button className="signup-button" style={{borderRadius: '0.5rem'}} onClick={()=>this.props.onCancel()}>ANNULLA</button>
                        <button 
                            className="signup-button" 
                            style={{borderRadius: '0.5rem'}} 
                            onClick={()=>this.props.onSignup(
                                document.getElementById("signup-input-username").value,
                                document.getElementById("signup-input-passw").value,
                                document.getElementById("signup-input-rpassw").value,
                            )}
                        >REGISTRATI</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default signup;