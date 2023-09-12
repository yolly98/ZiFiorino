import React, {Component} from 'react';
import '../style/desktop/BackupMenu.css';
import '../style/mobile/BackupMenu.css';

import cross from '../../images/delete.png';
import create from '../../images/new.png';
import restore from '../../images/restore.png';

class BackupMenu extends Component{

    state = {
        backups: this.props.backups
    }

    render(){
        return(
            <div id="backupMenu-section">
                <div id="backupMenu-container">
                    <div id="backupMenu-container1">
                        <label id="backupMenu-title">I tuoi backup</label>
                        <img loading='lazy' src={cross} style={{width: '1.5rem', cursor: 'pointer'}} onClick={()=>this.props.onCancel()}/>
                    </div>
                    <div id="backupMenu-container2">
                        {
                            this.state.backups.map(backup => (
                            <div
                                className = "backupMenu-item"
                                key = {backup.id}
                            >
                                <label>{backup.date}</label>
                                <div id="backupMenu-item-container">
                                    <img loading='lazy' id="backupMenu-item-new" src={create} style={{width: '2rem', cursor: 'pointer', marginRight: '1.2rem'}} onClick={()=>this.props.onNew(backup)}/>
                                    <img loading='lazy' id="backupMenu-item-restore" src={restore} style={{width: '2.5rem', cursor: 'pointer'}} onClick={()=>this.props.onRestore(backup)}/>
                                </div>
                            </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default BackupMenu;