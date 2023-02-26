import React, {Component} from 'react';
import '../style/Item.css'

import cross from '../../images/removeItem.png'

class Item extends Component{

    render(){
        return(
            <div className="item-col" style={{display: this.props.item.display}}>
                <div className="item-container">
                    <img className="image-item" src={this.props.item.image} alt="..." />
                    <div className="item-title-container"  onClick={() => this.props.onOpenItem(this.props.item)}>
                        <label className="item-title">{this.props.item.name}</label>
                    </div>
                    <img className="img-delete" src={cross} alt="..." onClick={() => this.props.onDeleteItem(this.props.item)}/>
                </div>
            </div>
        );
    }
}

export default Item;