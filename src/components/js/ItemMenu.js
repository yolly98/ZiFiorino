import React, {Component} from 'react';
import '../style/ItemMenu.css'

import cross from '../../images/delete.png';
import defaultImage from '../../images/defaultWebsite.png';
import showPassw from '../../images/showPassw.png';
import hidePassw from '../../images/hidePassw.png';
import copy from '../../images/copy.png';

class ItemMenu extends Component{

    state = {
        item: this.props.item,
        name: "",
        username: "",
        password: 0,
        notes: "",
        url: defaultImage
    }

    componentDidMount(){

        if(!this.state.item.hasOwnProperty("name"))
            return;
        
        // TODO request to server

        let name = this.state.item.name;
        let username = "test-username";
        let password = "test-password";
        let notes = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
        let image = this.state.item.image;

        document.getElementById("itemMenu-input-name").value = name;
        document.getElementById("itemMenu-input-username").value = username;
        document.getElementById("itemMenu-input-password").value = password;
        document.getElementById("itemMenu-input-notes").value = notes;
        document.getElementById("itemMenu-input-url").value = image;

        this.setState({ 
            name,
            username,
            password,
            notes,
            image
        });

    }

    copy(){

        let passw = document.getElementById('itemMenu-input-password');
        passw.type ='text';
        passw.select();
        passw.setSelectionRange(0,99999);//needed for mobile devices
        document.execCommand("copy");
        passw.type='password';
    }

    showPassw(){

        let passw = document.getElementById("itemMenu-input-password");
        let passwImage = document.getElementById("itemMenu-showPassw");
        if(passw.type == 'text'){
            passw.type = 'password';
            passwImage.src = hidePassw; 
        }
        else{
            passw.type = 'text';
            passwImage.src = showPassw;
        }
    }

    render(){
        return(
            <div id="itemMenu-section">
                <div id="itemMenu-container">
                    <div id="itemMenu-container2">
                        <img src={cross} style={{width: '1.5rem', cursor: 'pointer'}} onClick={()=>this.props.onCancel()}/>
                    </div>
                    <div id="itemMenu-container3">
                        <img id="itemMenu-image" src={this.state.item.image}/>
                        <label className='itemMenu-label'>Nome</label>
                        <input className="itemMenu-text" id="itemMenu-input-name" type="text" style={{marginBottom: '1rem'}}/>
                        <label className='itemMenu-label'>Username</label>
                        <input className="itemMenu-text" id="itemMenu-input-username" type="text" style={{marginBottom: '1rem'}}/>
                        <label className='itemMenu-label'>Password</label>
                        <div id="itemMenu-passwContainer">
                            <input className="itemMenu-text" id="itemMenu-input-password" type="password" style={{marginBottom: '1rem'}}/>
                            <img id="itemMenu-showPassw" src={hidePassw} onClick={() => this.showPassw()}></img>
                            <img id="itemMenu-copy" src={copy} onClick={() => this.copy()}></img>
                        </div>
                        <label className='itemMenu-label'>Url Icona</label>
                        <input  className="itemMenu-text" id="itemMenu-input-url" type="text" style={{marginBottom: '1rem'}}/>
                        <label className='itemMenu-label'>Note</label>
                        <textarea className="itemMenu-text" id="itemMenu-input-notes"></textarea>
                    </div>
                    <div id="itemMenu-container4">
                        <button className="itemMenu-button" style={{borderRadius: '0.5rem'}} onClick={()=>this.props.onRemove(this.state.item)}>RIMUOVI</button>
                        <button className="itemMenu-button" style={{borderRadius: '0.5rem'}} onClick={()=>this.props.onSave(this.state)}>SALVA</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ItemMenu;