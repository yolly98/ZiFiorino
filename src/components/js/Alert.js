import React, {Component} from 'react';
import '../style/Alert.css'

import cross from '../../images/delete.png'

class Alert extends Component{

    state = {
        title: this.props.alert.title,
        text: this.props.alert.text,
        image: this.props.alert.image
    }

    render(){
        return(
            <div id="alert-container" style={{zIndex: '10'}}>
                <div>
                    <div id="alert-container1">
                        <label id="alert-title">{this.state.title}</label>
                        <img id="alert-cross" onClick={() => this.props.closeAlert()} src={cross}/>
                    </div>
                    <div id="alert-container2">
                        <img id="alert-image" src={this.state.image}/>
                        <p id="alert-text">{this.state.text}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Alert;