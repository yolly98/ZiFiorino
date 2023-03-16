import React, {Component} from 'react';
import '../style/desktop/PasswMenu.css';
import '../style/mobile/PasswMenu.css';

import cross from '../../images/delete.png';
import changePassw from '../../images/security.png';
import showPassw from '../../images/showPassw.png';

class PasswMenu extends Component{

    state = {}

    showPassw(index){

        let passw = document.getElementsByClassName("passwMenu-input")[index];
        if(passw.type == 'text')
            passw.type = 'password';
        else
            passw.type = 'text';
    }

    render(){
        return(
            <div id="passwMenu-section">
                <div id="passwMenu-container">
                    <div id="passwMenu-container1">
                        <label id="passwMenu-title">Cambia Password</label>
                        <img id="passwMenu-cross" style={{width: '1.5rem', cursor: 'pointer'}} onClick={() => this.props.onCancel()} src={cross}/>
                    </div>
                    <div id="passwMenu-container2">
                        <img id="passwMenu-image" src={changePassw}/>
                        <div id="passwMenu-container2-1">
                            <label className="passwMenu-label">Inserisci Nuova Password</label>
                            <div className="passwMenu-passwContainer">
                                <input className="passwMenu-input" type='password'></input>
                                <img className="passwMenu-showPassw" src={showPassw} onClick={() => this.showPassw(0)}></img>
                            </div>
                            <label className="passwMenu-label">Ripeti Nuova Password</label>
                            <div className="passwMenu-passwContainer">
                                <input className="passwMenu-input" type='password'></input>
                                <img className="passwMenu-showPassw" src={showPassw} onClick={() => this.showPassw(1)}></img>
                            </div>
                        </div>
                    </div>
                    <div id="passwMenu-container3" style={{display: this.state.confirmationDisplay}}>
                        <button className="passwMenu-button" style={{borderRadius: '0.5rem'}} onClick={()=>this.props.onCancel()}>ANNULLA</button>
                        <button className="passwMenu-button" style={{borderRadius: '0.5rem'}} onClick={()=>this.props.onSave()}>CONFERMA</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default PasswMenu;