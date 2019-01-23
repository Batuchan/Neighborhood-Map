import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import SideBar from './components/SideBar.js'
import MenuIcon from './components/MenuIcon.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'

library.add(faBars, faSearch)

class App extends Component {

  state = {
    map: null,
    venues: [],
    markers: [],
    showSideBar: true,
    mapFull: false,
    query: '',
    infowindow: null
  }

  componentWillMount() {
    document.title = 'Trending Locations in Istanbul'
  }

  componentDidMount() {
    this.getVenues()
  }


  loadMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAWTT5uQYWEGetvUyJUaVHMfSJGUpCbXQM&callback=initMap")
    window.initMap = this.initMap
  }


  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "JTP1QHN3AQMD5EXKZSMO4GURD5MX4KNSIOOABRSCSYQVWMB4",
      client_secret: "30VVSEACM0GNDNUT55R0QSRBKRAPZUJTJQ505YZ3AUYLU5UP",
      query:"trending",
      near:"Istanbul",
      v:"20190101"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.loadMap())
      })
      .catch(error => {
        alert("Oops! An error occured getting locations from FourSquare.")
      })
  }

  sideBarState = () => {
    this.state.showSideBar ? this.setState({showSideBar: false}) : this.setState({showSideBar: true})
  }

  updateMarkers = (query) => {
    const activeMarkers = this.state.markers
    if (query) {
      activeMarkers.forEach((marker) => {
        marker.title.toLowerCase().includes(query.toLowerCase()) ?
          marker.setMap(this.state.map) : marker.setMap(null)
      })
    } else {
        activeMarkers.forEach((marker) => {
          marker.setMap(this.state.map)
        })
    }
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 40.9692184, lng: 28.9695738},
      zoom: 10
    });

    this.setState({ map })

    let markers = []

    // Create an info window
    const infoWindow = new window.google.maps.InfoWindow()

    // Loop through the venues
    this.state.venues.map(venues => {
      const position = {
        lat: venues.venue.location.lat,
        lng: venues.venue.location.lng
      };

      const contentString = `${venues.venue.name} <br>
      ${venues.venue.location.formattedAddress[0]} <br>
      ${venues.venue.location.formattedAddress[1]} <br>
      `


      // Create a marker
      venues.marker = new window.google.maps.Marker({
        map: map,
        position,
        title: venues.venue.name,
        animation: window.google.maps.Animation.DROP,
        id: venues.venue.id,
        formattedAddress: venues.venue.location.formattedAddress
      });

      // Event listener to open the info window
      venues.marker.addListener('click', function() {
        infoWindow.setContent(contentString)
        infoWindow.open(map, venues.marker);
      });

      markers.push(venues.marker)
      return venues
    })
    this.setState({ markers })
  }

  // Animate marker
  onListClick = (item) => {
    const markers = this.state.markers
    const filterMarker = markers.filter((marker) => marker.id === item.id)[0]
    const contentString = `${filterMarker.title} <br>
    ${filterMarker.formattedAddress[0]} <br>
    ${filterMarker.formattedAddress[1]} <br>
    `

    const infoWindow = new window.google.maps.InfoWindow()

    filterMarker.setAnimation(window.google.maps.Animation.BOUNCE)
    setTimeout(() => {filterMarker.setAnimation(-1)}, 1400)
    infoWindow.setContent(contentString)
    infoWindow.open(this.state.map, filterMarker);
    if (this.state.infowindow) {
      this.state.infowindow.close();
    }
    this.setState(() => ({ infowindow: infoWindow}))
  }

  render() {
    const sideBar = this.state.showSideBar;

    return (
      <div className="App">
        <main>
          <MenuIcon updateSideBar={this.sideBarState} />
          {sideBar ? <section id="map" role="application" aria-label="map" alt="map"></section> : <section id="map-full" role="application" aria-label="map" alt="map"></section>}
          {sideBar && <SideBar onListClick={this.onListClick} showSideBar={this.showSideBar} venues={this.state.markers} showVenues={this.state.showVenues} updateMarkers={this.updateMarkers} />}
        </main>
      </div>
    );
  }
}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  script.onerror = function() {
    alert("Error loading map: " + this.src)
  }
  index.parentNode.insertBefore(script, index)
}

export default App;
