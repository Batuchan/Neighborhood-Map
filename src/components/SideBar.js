import React, { Component } from 'react';
import '../App.css';
import ListItem from './ListItem.js'
import escapeRegExp from 'escape-string-regexp'

class SideBar extends Component {

	state = {
			query: '',
	}

	updateSearch = (query) => {
		this.setState({ query: query.trim() }, this.props.updateMarkers(query))

	}

  	render() {
		let showing
	  	if (this.state.query) {
			const match = new RegExp(escapeRegExp(this.state.query), 'i')
			showing = this.props.venues.filter((item) => match.test(item.title))
		} else {
			showing = this.props.venues
		}

		return (
		    <nav className="side-bar" aria-label="list of venues">
		    	<div className="filter-bar">
					<form className="filter-input">
						<input type="text" value={this.state.query} placeholder="Search names" onChange={(e) => this.updateSearch(e.target.value)}/>
					</form>
				</div>
		    	<ol className="venues-list" aria-label="list items">
			  	{showing.map(venue =>
			    	<ListItem key={venue.id} venue={venue} onListClick={this.props.onListClick} />
			  	)}
		    	</ol>
        </nav>
		)
	}
}

export default SideBar
