import React, {Component} from 'react';
import '../style/desktop/ItemMenu.css'
import '../style/mobile/ItemMenu.css'

import cross from '../../images/delete.png';
import defaultImage from '../../images/defaultWebsite.png';
import showPassw from '../../images/showPassw.png';
import copy from '../../images/copy.png';

class ItemMenu extends Component{

    state = {
        item: this.props.item,
        name: "",
        username: "",
        password: 0,
        notes: "",
        image: defaultImage
    }

    componentDidMount(){

        if(!this.state.item.hasOwnProperty("name"))
            return;

        let name = this.state.item.name;
        let username = this.state.item.username;
        let password = this.state.item.password;
        let notes = this.state.item.notes;
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

    copy(index){

        let input = document.getElementsByClassName('itemMenu-text-cop')[index];
        let isPassw = false;
        if(input.type == 'password')
            isPassw = true;
        if(isPassw)
            input.type ='text';
        input.select();
        input.setSelectionRange(0,99999);//needed for mobile devices
        document.execCommand("copy");
        if(isPassw)
            input.type='password';
        document.getElementsByClassName("itemMenu-copy-tooltip-label")[index].innerText = "Copiato";
    }

    showPassw(){

        let passw = document.getElementById("itemMenu-input-password");
        if(passw.type == 'text')
            passw.type = 'password';
        else
            passw.type = 'text';
    }

    render(){
        return(
            <div id="itemMenu-section">
                <div id="itemMenu-container">
                    <div id="itemMenu-container2">
                        <img src={cross} style={{width: '1.5rem', cursor: 'pointer'}} onClick={()=>this.props.onCancel()}/>
                    </div>
                    <div id="itemMenu-container3">
                        <img id="itemMenu-image" src={this.state.image}/>
                        <label className='itemMenu-label'>Nome</label>
                        <input className="itemMenu-text" id="itemMenu-input-name" type="text" style={{marginBottom: '1rem'}}/>
                        <label className='itemMenu-label'>Url Icona</label>
                        <input  className="itemMenu-text" id="itemMenu-input-url" type="text" style={{marginBottom: '1rem'}}/>
                        <label className='itemMenu-label'>Username</label>
                        <div id="itemMenu-usernameContainer" style={{marginBottom: '1rem'}}>
                            <input className="itemMenu-text-cop" id="itemMenu-input-username" type="text" />
                            <div className="itemMenu-container3-1">
                                <img className="itemMenu-copy" id="itemMenu-copy-username" src={copy} onClick={() => this.copy(0)}></img>
                                <div 
                                    className="itemMenu-copy-tooltip" 
                                    id="itemMenu-copy-tooltip-username">
                                        <label className="itemMenu-copy-tooltip-label">Copia</label>
                                </div>
                            </div>
                        </div>
                        <label className='itemMenu-label'>Password</label>
                        <div id="itemMenu-passwContainer" style={{marginBottom: '1rem'}}>
                            <input className="itemMenu-text-cop" id="itemMenu-input-password" type="password"/>
                            <div className="itemMenu-container3-1">
                                <img id="itemMenu-showPassw" src={showPassw} onClick={() => this.showPassw()}></img>
                                <img className="itemMenu-copy" id="itemMenu-copy-password" src={copy} onClick={() => this.copy(1)}></img>
                                <div 
                                    className="itemMenu-copy-tooltip" 
                                    id="itemMenu-copy-tooltip-password">
                                        <label className="itemMenu-copy-tooltip-label">Copia</label>
                                </div>
                            </div>
                        </div>
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