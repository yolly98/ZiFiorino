import React, {Component} from 'react';
import './App.css'

import Login from './components/js/Login';
import Alert from './components/js/Alert';
import Navbar from './components/js/Navbar';
import Item from './components/js/Item';
import ItemMenu from './components/js/ItemMenu';
import BackupMenu from './components/js/BackupMenu';

import infoAlert from './images/infoAlert.png'
import warningAlert from './images/warningAlert.png'
import backup from './images/cloud.png'
import errorAlert from './images/errorAlert.png'
import add from './images/add.png'
import refresh from './images/refresh.png'
import defaultWebSite from './images/defaultWebsite.png'

class App extends Component{

    state = {
        erverIp: "",
        serverPort: "",
        page: 'login',
        user: "",
        password: "",
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
        backupMenu: false
    }

    componentDidMount(){
        /*
        let serverIp = window.SERVER_IP;
        let serverPort = window.SERVER_PORT;
        this.setState({serverIp, serverPort});
        */
    }

    getItems(){

        // TODO request to database database
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
    }

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
    
    openAlert(title, text, image, confirmationDisplay = 'none', optionalObject = null){
        let alert = this.state.alert;
        alert.state = true;
        alert.title = title;
        alert.text = text;
        alert.image = image;
        alert.confirmationDisplay = confirmationDisplay;
        alert.optionalObject = optionalObject;

        if(confirmationDisplay != "none"){
            alert.onCancel = this.handleCloseAlert;
            alert.onConfirm = this.deleteItem;
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

    handleLogin = (user, password) =>{
        this.setState({user, password, page: "home"}, () => { this.getItems() });
    }

    handleSignup = (user, password) => {
        this.setState({user, password, page: "home"}, () => { this.getItems() });
    }
    
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
        this.setState({backupMenu: true});
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        document.getElementById('item-blocker').style.display = 'block';
        
    }

    handleCloseBackupMenu = () => {
        this.setState({backupMenu: false});
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
        document.getElementById('item-blocker').style.display = 'none';
    }
    
    handleOpenItem = item => {
        this.setState({itemMenu: this.state.items.indexOf(item)});
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        document.getElementById('item-blocker').style.display = 'block';
        
    }

    handleCloseItem = () => {
        this.setState({itemMenu: -1});
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
        document.getElementById('item-blocker').style.display = 'none';
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
        
        this.setState(
            {itemMenu: -1, items},
            function(){
                this.openAlert("SUCCESS", "Salvataggio avvenuto con successo", infoAlert);
                document.getElementsByTagName('body')[0].style.overflow = 'auto';
                document.getElementById('item-blocker').style.display = 'none';
            }
          );
        // TODO save item in database
    }

    handleDeleteItem = item => {
        this.openAlert("", "Vuoi davvero eliminare " + item.name, warningAlert, "flex", item);   
        if(this.state.itemMenu > -1){
            this.setState({itemMenu: -1});
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
            document.getElementById('item-blocker').style.display = 'none';
        } 
    }

    deleteItem = () => {
        // TODO remove from database

        //this.setState({itemMenu: this.state.cards.indexOf(card)});
        //document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        //document.getElementById('item-blocker').style.display = 'block';
        let item = this.state.alert.optionalObject;
        let items = [...this.state.items];
        items.splice(items.indexOf(item),1);
        this.setState(
          {items},
          function(){
            this.handleCloseAlert();
          }
        );
    }
      
    render(){
        let page;
        let alert;
        let itemMenu;
        let backupMenu;

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

            document.getElementsByTagName('body')[0].style.backgroundColor = "#2a5a76";
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
                            />
            }
            else
                backupMenu = <></>
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
                    {alert}
            </>

            document.getElementsByTagName('body')[0].style.backgroundColor = "white";
        }
        return (
            <div id="main-page">
                {page}
            </div>
        );
    }
}

export default App;

