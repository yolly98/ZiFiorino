import React, {Component} from 'react';
import '../style/BackupMenu.css'

import cross from '../../images/delete.png'

var MAX_NUMBER_OF_BACKUPS = 5;

class BackupMenu extends Component{

    state = {
        display: 'none',
        backups: []
    }

    componentDidMount(){

        let backups = [];
        for(let i = 0; i < MAX_NUMBER_OF_BACKUPS; i++){
            backups.push(
                {
                    id: i,
                    date: "03/03/2023"
                }
            );
        }
        this.setState({backups})
    }

    render(){
        return(
            <div id="backupMenu-section" style={{display: this.state.display}}>
                <div id="backupMenu-container2">
                    <label id="backupMenu-title">I tuoi backups</label>
                    <img src={cross} style={{width: '1.5rem', cursor: 'pointer'}} onClick={()=>this.props.onCancel()}/>
                </div>
                <div id="backupMenu-container3">
                    {
                        this.state.backups.map(backup => (
                        <div
                            className = "backupMenu-item"
                            key = {backup.id}
                        >
                            <lablel>{backup.date}</lablel>
                            <button>NUOVO</button>
                            <button>IMPORTA</button>
                        </div>
                        ))
                    }
                    </div>
                
            </div>
        );
    }
}

export default BackupMenu;