import React, {Component} from 'react';

import search from '../../images/search.png'
import exit from '../../images/exit.png'
import logo from '../../images/logo.png'

import '../style/Navbar.css'

class Navbar extends Component{
  render(){
    return(
      <nav id="nav">
        <div id="nav-container1">
          
          <div id="nav-container2">
            <div id="nav-logo-container">
              <img id="nav-logo" src={logo}/>
            </div>
            <label id="nav-title">ZiFiorino</label>
          </div>

          <div id="nav-container3">
            <div id="nav-container4">
              <label style={{color: "white"}}>Bentornato {this.props.user}</label>
              <img id="img-exit" src={exit}  onClick={() => this.props.onExit()}/>
            </div>
            <div id="nav-container5">
              <input id="input-search" type='text' onKeyUp={() => this.props.onSearch(document.getElementById('input-search').value)}/>
              <img id="img-search" src={search}  onClick={() => this.props.onSearch(document.getElementById('input-search').value)}/>
            </div>
          </div>

        </div>
      </nav>
    );
  }
}

export default Navbar;