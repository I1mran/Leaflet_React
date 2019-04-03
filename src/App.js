import React, { Component } from 'react';
import './App.css';
import L from 'leaflet';
import 'leaflet.control.opacity';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

//export default Map;
const styles = {
  root: {
    width: 300,
  },
  slider: {
    padding: '22px 0px',
  },
};
class App extends Component {

  constructor(props) {
    super(props);

    this.googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    this.googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    this.googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });
    this.jsonLayer=L.geoJSON();
  }

  componentDidMount() {
    // create map
    this.map = L.map('map', {
      center: [39.7165, -82.598],
      zoom: 16,
      layers: [this.googleStreets],
      attribution: false
  });

    fetch('../parcel.json').then(response => {
      return response.json();
    }).then(data => {
      // console.log(data);
      this.jsonLayer.addData(data,{
        style: {
          "color": "#ff7800",
          "weight": 5,
          "opacity": 1,
          // "dashArray": true
        }
      }).addTo(this.map);
    }).catch(err => {
      // Do something for an error here
      console.log("Error Reading data");
    });

    this.jsonLayer.on({
      "mouseover": function(e){
        e.sourceTarget.setStyle({
          weight: 5,
          color: '#000000',
          // dashArray: '',
          opacity: 0.7,
          "z-index": 999
        });

      },
      "mouseout": function(e) {
        this.resetStyle(e.sourceTarget)
      },
      "click":function(e) {
        // console.log(e.sourceTarget.getBounds());
        e.target._map.fitBounds(e.sourceTarget.getBounds());
      }
    });

    //BaseLayer
    var baseLayer = {
      "Google_Str": this.googleStreets,
      "Google_Sat": this.googleSat,
      "Google_Hyb": this.googleHybrid
    };

    //Overlay
    var overlay = {
      "Geojson": this.jsonLayer
    };
    L.control.layers(
        baseLayer,
        overlay,
        {collapsed: false}
    ).addTo(this.map);

    L.control.opacity(baseLayer).addTo(this.map);

  }
  state = {
    value: 1,
  };

  handleChange = (event, value) => {
    // console.log(value/100);
    this.jsonLayer.setStyle({opacity: value});
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;
    const { value } = this.state;
    return (
        <div className="App">
          <div className="div200">
            <Typography id="label">Slider For GeoJSON Layer </Typography>
            <div className="div180">
              <Slider classes={{ container: classes.slider }}
                      value={value}
                      min={0}
                      max={1}
                      step={.1}
                      aria-labelledby="label"
                      onChange={this.handleChange}/>
            </div>
            <div className="div20">
              <Typography>{value}</Typography>
            </div>
          </div>
          <div id="map"></div>
      </div>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(App);