import React, {Component} from 'react';
import './App.css'

import Login from './components/js/Login';
import Alert from './components/js/Alert';
import Navbar from './components/js/Navbar';

import warningAlert from './images/warningAlert.png'
import errorAlert from './images/errorAlert.png'

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
        let msg = "username: " + user + " , password: " + password;
        this.setState({user, password, page: "home"});
    }

    handleSignup = (user, password) => {
        let msg = "username: " + user + " , password: " + password;
        this.setState({user, password, page: "home"});
    }
    
    handleExit = () =>{
        let items = [];
        this.setState({user: "", password: "", page: "login", items});
    }

    handleSearch = inputText => {
        //console.log("search text pressed [" + inputText + "]")
        let searchingText = document.getElementById("input-search").value;
        /*
        let cards = [...this.state.cards];
        for(let i = 0; i < cards.length; i++){
          if(searchingText == "")
            cards[i].display = "flex";
          else if((cards[i].name.toLowerCase()).search(searchingText.toLowerCase()) == -1)
            cards[i].display = "none";
          else
            cards[i].display = "flex";
    
        }
        this.setState({cards});
        */
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
                    <Navbar 
                        user = {this.state.user}
                        onExit = {this.handleExit}
                        onSearch = {this.handleSearch}
                    />
                    {alert}
            </>
        }
        return (
            <div id="main-page">
                {page}
            </div>
        );
    }
}

export default App;

