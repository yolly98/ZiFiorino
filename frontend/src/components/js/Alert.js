import React, {Component} from 'react';
import '../style/desktop/Alert.css'
import '../style/mobile/Alert.css'


import cross from '../../images/delete.png'

class Alert extends Component{

    state = {
        title: this.props.alert.title,
        text: this.props.alert.text,
        image: this.props.alert.image,
        confirmationDisplay: this.props.alert.confirmationDisplay,
    }

    render(){
        return(
            <div id="alert-container" style={{zIndex: '10'}}>
                <div>
                    <div id="alert-container1">
                        <label id="alert-title">{this.state.title}</label>
                        <img loading='lazy' id="alert-cross" onClick={() => this.props.closeAlert()} src={cross}/>
                    </div>
                    <div id="alert-container2">
                        <img loading='lazy' id="alert-image" src={this.state.image}/>
                        <p id="alert-text">{this.state.text}</p>
                    </div>
                    <div id="alert-container3" style={{display: this.state.confirmationDisplay}}>
                        <button className="alert-button" style={{borderRadius: '0.5rem'}} onClick={()=>this.props.alert.onCancel()}>ANNULLA</button>
                        <button className="alert-button" style={{borderRadius: '0.5rem'}} onClick={()=>this.props.alert.onConfirm()}>CONFERMA</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Alert;