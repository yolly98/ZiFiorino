import React, {Component} from 'react';
import './App.css'

import Login from './components/js/Login';
import Alert from './components/js/Alert';
import Navbar from './components/js/Navbar';
import Item from './components/js/Item';
import ItemMenu from './components/js/ItemMenu';
import BackupMenu from './components/js/BackupMenu';
import PasswMenu from './components/js/PasswMenu';

import infoAlert from './images/infoAlert.png'
import warningAlert from './images/warningAlert.png'
import backup from './images/cloud.png'
import errorAlert from './images/errorAlert.png'
import add from './images/add.png'
import refresh from './images/refresh.png'
import defaultWebSite from './images/defaultWebsite.png'
import userGuide from './images/guide.png'
import changePassw from './images/security.png'

class App extends Component{

    state = {
        serverUrl: '',
        page: 'login',
        user: "",
        token: "",
        items: [],
        itemMenu: -1,
        alert: {
            state: false,
            title: "example",
            text: "exmaple text",
            image: infoAlert,
            confirmationDisplay: "none",
            onCancel: null,
            onConfirm: null,
            optionalObject: null
        },
        backupMenu: false,
        passwMenu: false
    }

    componentDidMount(){

        fetch('/config.json')
        .then(response => response.json())
        .then(data => {
            let serverUrl = data.server_url;
            this.setState({serverUrl});
        })
        .catch(error => console.error(error));
    }

    getItems(){

        // Test
        let items = [];
        for(let i = 0; i < 20; i++){
            items.push(
                {
                    id: i,
                    name: 'sito' + i,
                    image: defaultWebSite,
                    display: "flex"
                }
            )
        }
        this.setState({items})

        // ---
        /*
        let user = this.state.user;
        let token = this.state.token;
        let json_msg = {"token": token, "type": "get-items"};
        let url = this.state.serverIp + this.state.serverPort + "/backend/get-items.php";
        let msg = "body=" + JSON.stringify(json_msg);
        fetch(url, {
            method : "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body : msg
        }).then(
            response => response.json()
        ).then(
            html => {
                if (html.status == "SUCCESS") {
                    let _items = html.msg;
                    let items = [];
                    //console.log(items);
                    for(let i = 0; i < _items.length; i++){
                        let id = _items[i].id;
                        let item = _items[i].item.json();
                        items.push(
                            {
                                id: id, 
                                item: item
                            }
                        );
                    }
                    this.setState({login: false, _items});
                    //console.log(items);
                } else {
                    console.error(html.msg);
                    this.openAlert("ERROR", "Caricamento fallito", errorAlert);
                }
            }
        );
        */
    }

    // ---------------------- ALERT EVENTS -----------------------
    handleCloseAlert = () => {
        let alert = this.state.alert;
        alert.state = false;
        this.setState(
          {alert},
          function(){
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
            document.getElementById('blocker').style.display = 'none';
          }
        );    
    }
    
    openAlert(title, text, image, confirmationDisplay = 'none', optionalObject = null, cancelFunction = null, confirmFunction = null ){
        let alert = this.state.alert;
        alert.state = true;
        alert.title = title;
        alert.text = text;
        alert.image = image;
        alert.confirmationDisplay = confirmationDisplay;
        alert.optionalObject = optionalObject;

        if(confirmationDisplay != "none"){
            alert.onCancel =  cancelFunction;
            alert.onConfirm = confirmFunction;
        }
        else{
            alert.onCancel = null;
            alert.onConfirm = null;
        }
        this.setState(
          {alert},
          function(){
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            document.getElementById('blocker').style.display = 'block';
          }
        );
    }

    // ---------------- LOGIN/SIGNUP EVENTS ---------------------

    handleLogin = (user, password) =>{

        //console.log("login (" + user + ", " + password + ")");
        
        if(user == "" || password == ""){
            this.openAlert("ERROR", "Tutti i campi devono essere compilati", errorAlert);
            return;
        }
    
        let json_msg = {"user": user, "passw": password, "type": "login"};
        let url = this.state.serverUrl + "login.php";
        let msg = "body=" + JSON.stringify(json_msg);
        fetch(url, {
            method : "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body : msg
        }).then(
            response => response.json()
        ).then(
            html => {
                if (html.status == "SUCCESS") {
                    let token =  html.token;
                    console.log(token);
                    this.setState(
                        {user, token, page: "home"},
                        () => {this.getItems()}
                        );
                } else {
                    console.error(html.msg);
                    let msg = "";
                    if(html.msg == -4 || html.msg == -5)
                        msg = "Username o password non corretti";
                    else
                        msg = "Qualcosa è andato storto...";
                    this.openAlert("ERROR", msg, errorAlert);
                }
            }
        );
    }

    handleSignup = (user, password) => {
        //this.setState({user, page: "home"}, () => { this.getItems() });

        //console.log("login (" + user + ", " + password + ")");
        
        
        if(user == "" || password == ""){
            this.openAlert("ERROR", "Tutti i campi devono essere compilati", errorAlert);
            return;
        }
    
        let json_msg = {"user": user, "passw": password, "type": "signup"};
        let url = this.state.serverUrl + "login.php";
        let msg = "body=" + JSON.stringify(json_msg);
        fetch(url, {
            method : "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body : msg
        }).then(
            response => response.json()
        ).then(
            html => {
                
                if (html.status == "SUCCESS") {
                    console.log("signup success");
                    this.openAlert("SUCCESS", "Registrazione avvenuta con successo", infoAlert);
                }
                else {
                    console.error(html.msg);
                    let msg = "";
                    if(html.msg == -4)
                        msg = "Username già in uso";
                    else
                        msg = "Qualcosa è andato storto...";
    
                    this.openAlert("ERROR", msg, errorAlert);
                }      
            }
        );
    }

    // ------------------- NAVBAR EVENTS ------------------------
    
    handleExit = () =>{
        let items = [];
        this.setState({user: "", password: "", page: "login", items});
    }

    handleSearch = inputText => {

        let searchingText = inputText;
        
        let items = [...this.state.items];
        for(let i = 0; i < items.length; i++){
          if(searchingText == "")
            items[i].display = "flex";
          else if((items[i].name.toLowerCase()).search(searchingText.toLowerCase()) == -1)
            items[i].display = "none";
          else
            items[i].display = "flex";
    
        }

        document.getElementById("input-search").value = "";
        this.setState({items});
    }

    // ------------------ RAPID BUTTONS EVENT ------------------

    handleAddCard(){
        this.setState({itemMenu: -2});
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        document.getElementById('item-blocker').style.display = 'block';
    }
    
    handleRefresh(){
        this.getItems();
        this.openAlert("SUCCESS", "Elementi ricaricati", infoAlert);
    }

    handleOpenBackupMenu(){
        this.setState({backupMenu: true},
            () => {
                document.getElementsByTagName('body')[0].style.overflow = 'hidden';
                document.getElementById('item-blocker').style.display = 'block';
            });
    }

    handleChangePassw(){
        this.setState({passwMenu: true},
            () => {
                document.getElementsByTagName('body')[0].style.overflow = 'hidden';
                document.getElementById('item-blocker').style.display = 'block';
            });
    }

    handleOpenUserGuide(){
        window.open('/user-guide.pdf', '_blank')
    }

    // ------------------- BACKUPMENU EVENTS ---------------------

    handleCloseBackupMenu = () => {
        this.setState({backupMenu: false});
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
        document.getElementById('item-blocker').style.display = 'none';
    }

    handleNewBackup = backup => {
        let msg = "Vuoi sovrascrivere il backup del " + backup.date + "?";
        this.openAlert("New Backup", msg, warningAlert, "flex", backup, this.handleCloseAlert, this.createNewBackup);
    }

    createNewBackup = () => {
        let backup = this.state.alert.optionalObject;
        console.log("create new backup (overwrite  " + backup.date + ")");
        this.handleCloseAlert();
    }

    handleRestoreFromBackup = backup => {
        let msg = "Vuoi importare il backup del " + backup.date + "?";
        this.openAlert("Restore Backup", msg, warningAlert, "flex", backup, this.handleCloseAlert, this.restoreBackup);
    }

    restoreBackup = () => {
        let backup = this.state.alert.optionalObject;
        console.log("restore backup of " + backup.date );
        this.handleCloseAlert();
    }
    
    // ----------------------- ITEM EVENTS -----------------------

    handleOpenItem = item => {
        this.setState({itemMenu: this.state.items.indexOf(item)},
        () => {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            document.getElementById('item-blocker').style.display = 'block';
        });
    }

    handleCloseItem = () => {
        this.setState({itemMenu: -1},
            () => {
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
            document.getElementById('item-blocker').style.display = 'none';
            });
    }

    handleSaveItem = state => {
        
        let item = state.item;
        let isNewItem = false;
        let items = [...this.state.items];

        if(!item.hasOwnProperty("id")){
            isNewItem = true;
            // item.id = -3;
            let maxId = 0;
            for(let _item of items)
                if(_item.id > maxId)
                    maxId = _item.id;
            item.id = maxId + 1;
        }
        
        item.name = document.getElementById("itemMenu-input-name").value;
        item.image = document.getElementById("itemMenu-input-url").value;
        if(item.image == "")
            item.image = defaultWebSite;

        console.log(item);
        
        if(items.length == 0)
            items.push(item);
        for(let i = 0; i < items.length; i++){
            if(items[i].id == item.id){
                items[i] = item;
                break;
            }
            if(i == items.length - 1)
                items.push(item);
        }
        
        // Test
        this.setState(
            {itemMenu: -1, items},
            function(){
                this.openAlert("SUCCESS", "Salvataggio avvenuto con successo", infoAlert);
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
                document.getElementById('item-blocker').style.display = 'none';
            }
          );
        
        // ---
        /*
        //html request
        //console.log(item_db);
        let json_msg = {};
        json_msg.token = this.state.token;
        json_msg.item = item;
        if(isNewItem)
          json_msg.type = "new";
        else
          json_msg.type = "update";
        //console.log(json_msg);
        let url = this.state.serverIp + this.state.serverPort +"/backend/newUpdateItem.php";
        let msg = "body=" + JSON.stringify(json_msg);
        fetch(url, {
            method : "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body : msg
        }).then(
            response => response.json()
        ).then(
            html => {
                if (html.status == "SUCCESS") {
                  if(isNewItem)
                    items[items.length - 1].id = Number(html.id);
                    //console.log(cards);
                    this.setState(
                        {itemMenu: -1, items},
                        function(){
                            this.openAlert("SUCCESS", "Salvataggio avvenuto con successo", infoAlert);
                        }
                    );
                    document.getElementsByTagName('body')[0].style.overflow = 'auto';
                    document.getElementById('blocker1').style.display = 'none'; 
                } else {
                    // console.error(html.msg);
                    this.openAlert("ERROR", "Salvataggio fallito", infoAlert);
                }
            }
        );
        */
    }

    handleDeleteItem = item => {
        this.openAlert("", "Vuoi davvero eliminare " + item.name, warningAlert, "flex", item, this.handleCloseAlert, this.deleteItem);   
        if(this.state.itemMenu > -1){
            this.setState({itemMenu: -1}, 
                () => {
                    document.getElementsByTagName('body')[0].style.overflow = 'auto';
                    document.getElementById('item-blocker').style.display = 'none';
                });
        } 
    }

    deleteItem = () => {
        
        let item = this.state.alert.optionalObject;

        // Test
        let items = [...this.state.items];
        items.splice(items.indexOf(item),1);
        this.setState(
          {items},
          function(){
            this.handleCloseAlert();
          }
        );

        // ---
        /*
        //console.log("delete button pressed [" + card.name + "]");
        //html request
        let json_msg = {};
        json_msg.token = this.state.token;
        json_msg.id = card.id;
        //console.log(json_msg);
        let url = this.state.serverIp + this.state.serverPort + "/backend/removeItem.php";
        let msg = "body=" + JSON.stringify(json_msg);
        fetch(url, {
            method : "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body : msg
        }).then(
            response => response.json()
        ).then(
            html => {
                if (html.status == "SUCCESS") {
                    let items = [...this.state.items];
                    items.splice(items.indexOf(item), 1);
                    this.setState(
                        {items},
                        function(){
                            this.openAlert("SUCCESS", (item.name + " rimosso!"), infoAlert);
                        }
                    );
                } else {
                    // console.error(html.msg);
                    this.openAlert("ERROR", ("Rimozione di " + item.name + " fallita"), errorAlert);
                }
            }
        );
        */
    }

    // ----------------------- PASSW MENU EVENTS -----------------------

    handleClosePasswMenu = () => {
        this.setState({passwMenu: false},
            () => {
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
                document.getElementById('item-blocker').style.display = 'none';
            });
        
    }

    handleSaveNewPassw = () => {
        
        let passw = document.getElementsByClassName("passwMenu-input")[0].value;
        let r_passw = document.getElementsByClassName("passwMenu-input")[1].value;
        if(passw != r_passw){
            this.openAlert("ERROR", "Le password inserite non sono uguali", errorAlert);
            return;
        }
        
        // Test
        this.setState({passwMenu: false},
            () => {
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
                document.getElementById('item-blocker').style.display = 'none';
                this.openAlert("", "Password modificata con success", infoAlert);
            });

        // --
        /*
        let json_msg = {"token": this.state.token, "passw": passw};
        let url = this.state.serverIp + this.state.serverPort + "/backend/change-passw.php";
        let msg = "body=" + JSON.stringify(json_msg);
        fetch(url, {
                method : "POST",
                headers: {
                'Content-type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            body : msg
        }).then(
            response => response.json()
        ).then(
            html => {
                if (html.status == "SUCCESS") {
                    //console.log("change password success");
                    this.openAlert("SUCCESS", "Password aggiornata con successo", infoAlert);
                }
                else {
                    console.error(html.msg);
                    let msg = "Qualcosa è andato storto...";
                    this.openAlert("ERROR", msg, errorAlert);
                }      
            }
        );
        */
        
    }

    // ------------------------------------------------------
      
    render(){
        let page;
        let alert;
        let itemMenu;
        let backupMenu;
        let passwMenu;

        if(this.state.alert.state){
            alert = <Alert
                      alert = {this.state.alert}
                      closeAlert = {this.handleCloseAlert}
                    />
          }
          else
            alert = <></>

        if (this.state.page == 'login'){
            page = <>
                    <div 
                        id="blocker" 
                        style={{
                            width: '100%', 
                            height: '100%', 
                            backgroundColor: 'black',
                            opacity: '0.4', 
                            position: 'fixed', 
                            top: '0', 
                            zIndex: '9', 
                            display: "none"
                        }} 
                    />
                    <Login
                        onLogin = {this.handleLogin}
                        onSignup = {this.handleSignup}
                    />
                    {alert}
            </>

            document.getElementsByTagName('body')[0].style.backgroundColor = "var(--color1)";
        }

        else if (this.state.page == 'home'){
            if(this.state.itemMenu >= 0){
                itemMenu = <ItemMenu 
                            onCancel = {this.handleCloseItem} 
                            onSave = {this.handleSaveItem} 
                            onRemove = {this.handleDeleteItem}
                            item = {this.state.items[this.state.itemMenu]} 
                          />
            }else if(this.state.itemMenu == -2){
              itemMenu = <ItemMenu
                            onCancel = {this.handleCloseItem} 
                            onSave = {this.handleSaveItem} 
                            item = {{}} 
                          />
            }
            else
              itemMenu = <></>

            if(this.state.backupMenu){
                backupMenu = <BackupMenu 
                                onCancel = {this.handleCloseBackupMenu}
                                onNew = {this.handleNewBackup}
                                onRestore = {this.handleRestoreFromBackup}
                            />
            }
            else
                backupMenu = <></>

            if(this.state.passwMenu){
                passwMenu = <PasswMenu
                                onCancel = {this.handleClosePasswMenu} 
                                onSave = {this.handleSaveNewPassw}
                            />
            }
            else
                passwMenu = <></>
            page = <>
                    <div 
                        id="blocker" 
                        style={{
                            width: '100%', 
                            height: '100%', 
                            backgroundColor: 'black',
                            opacity: '0.4', 
                            position: 'fixed', 
                            top: '0', 
                            zIndex: '9', 
                            display: "none"
                        }} 
                    />
                    <div 
                        id="item-blocker" 
                        style={{
                            width: '100%', 
                            height: '100%', 
                            backgroundColor: 'black',
                            opacity: '0.4', 
                            position: 'fixed', 
                            top: '0', 
                            zIndex: '7', 
                            display: "none"
                        }} 
                    />
                    <Navbar 
                        user = {this.state.user}
                        onExit = {this.handleExit}
                        onSearch = {this.handleSearch}
                    />
                    <img id="add-item" src={add} onClick={() => this.handleAddCard()} />
                    <img id="refresh" src={refresh} onClick={() => this.handleRefresh()} />
                    <img id="open-backup" src={backup} onClick={() => this.handleOpenBackupMenu()} />
                    <img id="change-passw" src={changePassw} onClick={() => this.handleChangePassw()} />
                    <img id="user-guide" src={userGuide} onClick={() => this.handleOpenUserGuide()} />

                    <div className='items-container'>
                    {
                        this.state.items.map(item => (
                        <Item
                            key = {item.id}
                            onOpenItem = {this.handleOpenItem}
                            onDeleteItem = {this.handleDeleteItem}
                            item = {item}
                        />
                        ))
                    }
                    </div>
                    {itemMenu}
                    {backupMenu}
                    {passwMenu}
                    {alert}
            </>

            document.getElementsByTagName('body')[0].style.backgroundColor = "var(--color2)";
        }
        return (
            <div id="main-page">
                {page}
            </div>
        );
    }
}

export default App;

