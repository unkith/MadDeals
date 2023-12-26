import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = (props) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [secLat, setSecLat] = useState(null);
  const [secLon, setSecLon] = useState(null);
  const [name, setName] = useState('');
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [popular, setPopular] = useState([])
  const [zoomLevel, setZoomLevel] = useState(12);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let currentLocation;
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        if (props.route && props.route.params && props.route.params.location) {
          const { lat, lon } = props.route.params.location;
          setSecLat(lat);
          setSecLon(lon);
          setName(props.route.params.location.name);
        } else {
          const response = await fetch(`https://api.geoapify.com/v2/places?categories=catering.restaurant,catering.fast_food&filter=circle:${currentLocation.coords.longitude},${currentLocation.coords.latitude},1000&bias=proximity:${currentLocation.coords.longitude},${currentLocation.coords.latitude}&limit=100&apiKey=54e1a62e66a34d32a0f17b1de7af1121`);
          const data = await response.json();
          setPopular(data.features);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.route]);

  useEffect(() => {
    if (location && secLat !== null && secLon !== null) {
      setPolylineCoordinates([
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        {
          latitude: secLat,
          longitude: secLon,
        },
      ]);
    }
  }, [location, secLat, secLon]);

  const handleZoomOut = () => {
    if (mapRef) {
      const newZoomLevel = zoomLevel + 1;
      setZoomLevel(newZoomLevel);
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922 / Math.pow(2, 12 - newZoomLevel),
        longitudeDelta: 0.0421 / Math.pow(2, 12 - newZoomLevel),
      };
      mapRef.animateToRegion(newRegion, 500); // Adjust the duration as needed
    }
  };
  
  const handleZoomIn = () => {
    if (mapRef && zoomLevel > 0) {
      const newZoomLevel = zoomLevel - 1;
      setZoomLevel(newZoomLevel);
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922 / Math.pow(2, 12 - newZoomLevel),
        longitudeDelta: 0.0421 / Math.pow(2, 12 - newZoomLevel),
      };
      mapRef.animateToRegion(newRegion, 500); // Adjust the duration as needed
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922 / Math.pow(2, 12 - zoomLevel),
            longitudeDelta: 0.0421 / Math.pow(2, 12 - zoomLevel),
          }}
          provider={MapView.PROVIDER_DEFAULT}
          ref={(ref) => setMapRef(ref)}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            description="You are here!"
          />
          {popular.length > 0 && popular.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.geometry.coordinates[1],
                longitude: place.geometry.coordinates[0],
              }}
              title={place.properties.name}
              description={place.properties.address}
              pinColor="blue" // Adjust pin color as needed
            />
          ))}
          {secLat !== null && secLon !== null && (
            <Marker
              coordinate={{
                latitude: secLat,
                longitude: secLon,
              }}
              title={name}
              description="This is the selected location"
              pinColor="green"
            />
          )}
          {polylineCoordinates.length === 2 && (
            <Polyline
              coordinates={polylineCoordinates}
              strokeColor="#000000" // Line color
              strokeWidth={7} // Line width
            />
          )}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
      <TouchableOpacity style={styles.zoomInButton} onPress={handleZoomIn}>
        <Text>+</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.zoomOutButton} onPress={handleZoomOut}>
        <Text>-</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  zoomInButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
  zoomOutButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },
});

export default MapScreen;
