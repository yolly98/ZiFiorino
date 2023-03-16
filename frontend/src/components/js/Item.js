import React, {Component} from 'react';
import '../style/desktop/Item.css'
import '../style/mobile/Item.css'

import cross from '../../images/removeItem.png'

class Item extends Component{

    render(){
        return(
            <div className="item-col" style={{display: this.props.item.display}}>
                <div className="item-container" onClick={() => this.props.onOpenItem(this.props.item)}>
                    <div className="item-container1">
                        <img className="image-item" src={this.props.item.image} alt="..." />
                        <div className="item-title-container">
                            <label className="item-title">{this.props.item.name}</label>
                        </div>
                    </div>
                    <div className="item-container2">
                        <img 
                            className="img-delete" 
                            src={cross} 
                            alt="..." 
                            onClick={(event) => {
                                event.stopPropagation();
                                this.props.onDeleteItem(this.props.item)
                            }}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Item;