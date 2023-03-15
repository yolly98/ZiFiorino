import React, {Component} from 'react';
import '../style/desktop/ItemMenu.css'
import '../style/tablet/ItemMenu.css'
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

    copy(){

        let passw = document.getElementById('itemMenu-input-password');
        passw.type ='text';
        passw.select();
        passw.setSelectionRange(0,99999);//needed for mobile devices
        document.execCommand("copy");
        passw.type='password';
        document.getElementById("itemMenu-copy-tooltip-label").innerText = "Copiato";
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
                        <label className='itemMenu-label'>Username</label>
                        <input className="itemMenu-text" id="itemMenu-input-username" type="text" style={{marginBottom: '1rem'}}/>
                        <label className='itemMenu-label'>Password</label>
                        <div id="itemMenu-passwContainer" style={{marginBottom: '1rem'}}>
                            <input className="itemMenu-text" id="itemMenu-input-password" type="password"/>
                            <img id="itemMenu-showPassw" src={showPassw} onMouseDown={() => this.showPassw()} onMouseUp={() => this.showPassw()}></img>
                            <img id="itemMenu-copy" src={copy} onClick={() => this.copy()}></img>
                            <div id="itemMenu-copy-tooltip"><label id="itemMenu-copy-tooltip-label">Copia</label></div>
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