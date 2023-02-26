import React, {Component} from 'react';
import './App.css'

import Login from './components/js/Login';
import Alert from './components/js/Alert';
import Navbar from './components/js/Navbar';
import Item from './components/js/Item';

import warningAlert from './images/warningAlert.png'
import errorAlert from './images/errorAlert.png'
import add from './images/add.png'
import refresh from './images/refresh.png'

class App extends Component{

    state = {
        erverIp: "",
        serverPort: "",
        page: 'login',
        user: "",
        password: "",
        items: [],
        alert: {
            state: false,
            title: "example",
            text: "exmaple text",
            image: warningAlert
        }
    }

    componentDidMount(){
        /*
        let serverIp = window.SERVER_IP;
        let serverPort = window.SERVER_PORT;
        this.setState({serverIp, serverPort});
        */
    }

    getItems(){
        let items = [];
        for(let i = 0; i < 20; i++){
            items.push(
                {
                    id: i,
                    name: 'sito' + i,
                    image: "https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196",
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
    
    openAlert(title, text, image){
        let alert = this.state.alert;
        alert.state = true;
        alert.title = title;
        alert.text = text;
        alert.image = image;
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
        //console.log("search text pressed [" + inputText + "]")
        let searchingText = document.getElementById("input-search").value;
        
        let items = [...this.state.items];
        for(let i = 0; i < items.length; i++){
          if(searchingText == "")
            items[i].display = "flex";
          else if((items[i].name.toLowerCase()).search(searchingText.toLowerCase()) == -1)
            items[i].display = "none";
          else
            items[i].display = "flex";
    
        }
        this.setState({items});
    }

    handleAddCard(){
        //console.log("add card pressed");
        /*this.setState({itemMenu: -2});
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        document.getElementById('blocker1').style.display = 'block';*/
        this.openAlert("Add item", "aggiunta item", warningAlert);
    }

    
    handleRefresh(){
        this.getItems();
        this.openAlert("SUCCESS", "Elementi ricaricati", warningAlert);
    }
    
    handleOpenItem = item => {
        //this.setState({itemMenu: this.state.cards.indexOf(card)});
        //document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        //document.getElementById('item-blocker').style.display = 'block';
        this.openAlert("Open Item", item.name, warningAlert);
    
    }

    handleDeleteItem = item => {
        //this.setState({itemMenu: this.state.cards.indexOf(card)});
        //document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        //document.getElementById('item-blocker').style.display = 'block';
        let items = [...this.state.items];
        items.splice(items.indexOf(item),1);
        this.setState(
          {items},
          function(){
            this.openAlert("SUCCESS", (item.name + " rimosso!"), warningAlert);
          }
        );
    
    }
      
    render(){
        let page;

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
                            zIndex: '9', 
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

