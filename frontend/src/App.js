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
        backupMenu :{
            state: false,
            max_number_of_backups: 5,
            backups: []
        },
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

        let token = this.state.token;
        let json_msg = {};
        json_msg.token = token;
        let url = this.state.serverUrl + "get-items.php";
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
                    let _items = JSON.parse(html.items);
                    let items = [];
                    for(let i = 0; i < _items.length; i++){
                        let id = _items[i].id;
                        let name = _items[i].name;
                        let url = _items[i].urlImage;
                        items.push(
                            {
                                id: id, 
                                name: name,
                                image: url,
                                display: "flex"
                            }
                        );
                    }
                    this.setState({page: 'home', items});
                    //console.log(items);
                } else {
                    console.error(html.msg);
                    this.openAlert("ERROR", "Caricamento fallito", errorAlert);
                }
            }
        );
        
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

        if(user == "" || password == ""){
            this.openAlert("ERROR", "Tutti i campi devono essere compilati", errorAlert);
            return;
        }
    
        let json_msg = {};
        json_msg.user = user;
        json_msg.passw = password;
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
                        {user, token},
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
        
        if(user == "" || password == ""){
            this.openAlert("ERROR", "Tutti i campi devono essere compilati", errorAlert);
            return;
        }

        if (user.length > 30 || password.length > 30){
            this.openAlert("ERROR", "Username e password non possono avare più di 30 caratteri", errorAlert);
            return;
        }
    
        let json_msg = {};
        json_msg.user = user;
        json_msg.passw = password;
        let url = this.state.serverUrl + "signup.php";
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

        // document.getElementById("input-search").value = "";
        this.setState({items});
    }

    // ------------------ RAPID BUTTONS EVENT ------------------

    handleAddItem(){
        this.setState({itemMenu: -2});
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        document.getElementById('item-blocker').style.display = 'block';
    }
    
    handleRefresh(){
        this.getItems();
        this.openAlert("SUCCESS", "Elementi ricaricati", infoAlert);
    }

    handleOpenBackupMenu(){

        let token = this.state.token;
        let json_msg = {};
        json_msg.token = token;
        let url = this.state.serverUrl + "get-backups.php";
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
                    
                    let backupMenu = this.state.backupMenu;
                    backupMenu.state = true;
                    let _backups = html.backups;
                    let backups = [];
                    for(let i = 0; i < this.state.backupMenu.max_number_of_backups; i++){
                        let file_name = "Vuoto";
                        if( i < _backups.length){
                            file_name = _backups[i];
                            file_name = file_name.replace(/!/g, " ");
                            file_name = file_name.replace(/_/g, ":");
                            file_name = file_name.replace(".json", "");
                        }
                        backups.push(
                            {
                                id: i,
                                date: file_name
                            }
                        );
                    }

                    backups.sort(function(a, b) {
                        return a.date - b.date;
                      });
                    backupMenu.backups = backups;
                    this.setState({backupMenu},
                        () => {
                            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
                            document.getElementById('item-blocker').style.display = 'block';
                        });
                    
                } else {
                    console.error(html.msg);
                    this.openAlert("ERROR", "Caricamento fallito", errorAlert);
                }
            }
        );
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
        let backupMenu = this.state.backupMenu;
        backupMenu.state = false;
        backupMenu.backups = [];
        this.setState({backupMenu},
            () => {
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
                document.getElementById('item-blocker').style.display = 'none';
            });
    }

    handleNewBackup = backup => {
        let msg = "Vuoi sovrascrivere il backup del " + backup.date + "?";
        this.openAlert("New Backup", msg, warningAlert, "flex", backup, this.handleCloseAlert, this.createNewBackup);
    }

    createNewBackup = () => {

        this.handleCloseAlert();

        let backup = this.state.alert.optionalObject;
        let old_file_name = backup.date;
        if (backup.date != "Vuoto"){
            old_file_name = old_file_name.replace(/ /g, "!");
            old_file_name = old_file_name.replace(/:/g, "_");
            old_file_name = old_file_name + ".json";
        }
        else
            old_file_name = "new";
        let new_file_name = (new Date()).toLocaleString();
        new_file_name = new_file_name.replace(/\//g, "-");
        let new_date = new_file_name;
        new_file_name = new_file_name.replace(/ /g, "!");
        new_file_name = new_file_name.replace(/:/g, "_");
        new_file_name += ".json";

        let json_msg = {};
        json_msg.token = this.state.token;
        json_msg.old_file_name = old_file_name;
        json_msg.new_file_name = new_file_name;
        let url = this.state.serverUrl + "create-backup.php";
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

                    let backupMenu = this.state.backupMenu;
                    let backups = this.state.backupMenu.backups;
                    backups[backups.indexOf(backup)].date = new_date;
                    backupMenu.backups = backups;
                    this.setState({backupMenu},
                        () => {
                            this.openAlert("", "Nuovo backup creato con successo", infoAlert);
                    });
                }
                else {
                    console.error(html.msg);
                    this.openAlert("ERROR", "Qualcosa è andato storto...", errorAlert);
                }      
            }
        );
    }

    handleRestoreFromBackup = backup => {
        let msg = "Vuoi importare il backup del " + backup.date + "?";
        this.openAlert("Restore Backup", msg, warningAlert, "flex", backup, this.handleCloseAlert, this.restoreBackup);
    }

    restoreBackup = () => {

        this.handleCloseAlert();

        let backup = this.state.alert.optionalObject;
        let file_name = backup.date;
        file_name = file_name.replace(/ /g, "!");
        file_name = file_name.replace(/:/g, "_");
        file_name = file_name + ".json";

        let json_msg = {};
        json_msg.token = this.state.token;
        json_msg.file_name = file_name;
        let url = this.state.serverUrl + "restore-backup.php";
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
                    this.handleRefresh();
                    this.openAlert("", "I tuoi dati sono stati riportati allo stato del backup", infoAlert);
                }
                else {
                    console.error(html.msg);
                    this.openAlert("ERROR", "Qualcosa è andato storto...", errorAlert);
                }      
            }
        );
    }
    
    // ----------------------- ITEM EVENTS -----------------------

    handleOpenItem = item => {

        let token = this.state.token;
        let json_msg = {};
        json_msg.token = token;
        json_msg.id = item.id;
        let url = this.state.serverUrl + "get-item-data.php";
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
                    
                    let item_body = JSON.parse(html.item);
                    item.username = item_body.username;
                    item.password = item_body.password;
                    item.notes = item_body.notes;
                    this.setState({
                        itemMenu: this.state.items.indexOf(item)},
                        () => {
                            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
                            document.getElementById('item-blocker').style.display = 'block';
                    });
                    
                } else {
                    console.error(html.msg);
                    this.openAlert("ERROR", "Caricamento fallito", errorAlert);
                }
            }
        );
    }

    handleCloseItem = () => {
        this.setState({itemMenu: -1},
            () => {
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
            document.getElementById('item-blocker').style.display = 'none';
            });
    }

    handleSaveItem = state => {


        let name = document.getElementById("itemMenu-input-name").value;
        let username = document.getElementById("itemMenu-input-username").value;
        let password = document.getElementById("itemMenu-input-password").value;
        let image = document.getElementById("itemMenu-input-url").value;
        let notes = document.getElementById("itemMenu-input-notes").value;
        let id;

        if(image == "")
            image = defaultWebSite;
        
        let item = state.item;
        let item_db = {};
        let isNewItem = false;
        
        if(!item.hasOwnProperty("id")){
            isNewItem = true;
            id = 0;
        }
        else
            id = item.id;

        item_db.name = name;
        item_db.username = username;
        item_db.password = password;
        item_db.urlImage = image;
        item_db.notes = notes;
        item_db.id = id;
       
        let json_msg = {};
        let url = this.state.serverUrl
        json_msg.token = this.state.token;
        json_msg.item = item_db;
        if(isNewItem)
            url += "add-item.php";
        else
            url += "update-item.php";
        
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

                    item.name = name;
                    item.image = image;

                    if(isNewItem)
                        item.id = Number(html.id);

                    let items = [...this.state.items];
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

                    this.setState(
                        {itemMenu: -1, items},
                        function(){
                            this.openAlert("SUCCESS", "Salvataggio avvenuto con successo", infoAlert);
                            document.getElementsByTagName('body')[0].style.overflow = 'auto';
                            document.getElementById('item-blocker').style.display = 'none';
                        }
                    );
                } else {
                    console.error(html.msg);
                    this.openAlert("ERROR", "Salvataggio fallito", infoAlert);
                }
            }
        );
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

        let json_msg = {};
        json_msg.token = this.state.token;
        json_msg.id = item.id;
        let url = this.state.serverUrl + "remove-item.php";
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
                            this.handleCloseAlert();
                        }
                    );
                } else {
                    console.error(html.msg);
                    this.openAlert("ERROR", ("Rimozione di " + item.name + " fallita"), errorAlert);
                }
            }
        );
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

        if(passw == "" || r_passw == ""){
            this.openAlert("ERROR", "Le password non posso essere vuote", errorAlert);
            return;
        }
        if(passw.length > 30 || r_passw.length > 30){
            this.openAlert("ERROR", "Le password inserite sono troppo lunghe (massimo 30 caratteri)", errorAlert);
            return;
        }
        if(passw != r_passw){
            this.openAlert("ERROR", "Le password inserite non sono uguali", errorAlert);
            return;
        }
        
        let json_msg = {};
        json_msg.token = this.state.token;
        json_msg.password = passw;
        let url = this.state.serverUrl + "change-passw.php";
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
                    this.setState({passwMenu: false, page: 'login'},
                        () => {
                            document.getElementsByTagName('body')[0].style.overflow = 'auto';
                            this.openAlert("", "Password modificata con successo, verrai reindirizzato al login", infoAlert);
                    });
                }
                else {
                    console.error(html.msg);
                    this.openAlert("ERROR", "Qualcosa è andato storto...", errorAlert);
                }      
            }
        );
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
                            onRemove = {this.handleCloseItem}
                            item = {{}} 
                          />
            }
            else
              itemMenu = <></>

            if(this.state.backupMenu.state){
                backupMenu = <BackupMenu 
                                backups = {this.state.backupMenu.backups}
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
                    <img id="add-item" src={add} onClick={() => this.handleAddItem()} />
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

