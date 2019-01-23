import React, { Component } from 'react';
import '../App.css';


class ListItem extends Component {

	render() {
		return (
				<li aria-label={this.props.venue.title + this.props.venue.formattedAddress} tabIndex="0" className="list-item" onClick={() => this.props.onListClick(this.props.venue)}>{this.props.venue.title}</li>
		)
	}
}

export default ListItem
