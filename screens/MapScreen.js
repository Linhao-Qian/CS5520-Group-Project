import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { fetchNearbyPlaces } from "../services/locationService";
import { Button, Dialog, Portal, RadioButton, Provider } from "react-native-paper";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("Pharmacy");

  const placeTypes = [
    { label: "Pharmacy", value: "Pharmacy" },
    { label: "Hospital", value: "Hospital" },
    { label: "Clinic", value: "Clinic" },
  ];

  useEffect(() => {
    const loadLocationAndPlaces = async () => {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      const nearbyPlaces = await fetchNearbyPlaces(currentLocation.coords, selectedType);
      setPlaces(nearbyPlaces);
      setLoading(false);
    };

    loadLocationAndPlaces();
  }, [selectedType]);

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const handleTypeChange = (type) => {
    setSelectedType(type);
    hideDialog();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{errorMsg || "Fetching location..."}</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View style={styles.container}>
        {/* Type Selection Button */}
        <View style={styles.dialogContainer}>
          <Button onPress={showDialog} mode="contained" style={styles.menuButton}>
            {selectedType}
          </Button>
        </View>

        {/* Dialog for Selecting Place Type */}
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Title>Select Place Type</Dialog.Title>
            <Dialog.Content>
              <RadioButton.Group onValueChange={handleTypeChange} value={selectedType}>
                {placeTypes.map((type) => (
                  <RadioButton.Item
                    key={type.value}
                    label={type.label}
                    value={type.value}
                    labelStyle={{ fontSize: 16 }}
                  />
                ))}
              </RadioButton.Group>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>Cancel</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Map */}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="Your Location"
            pinColor="blue"
          />

          {places.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: place.geometry.location.lat,
                longitude: place.geometry.location.lng,
              }}
              title={place.name}
              pinColor="red"
            />
          ))}
        </MapView>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialogContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  menuButton: {
    backgroundColor: "#4CAF50",
  },
});

export default MapScreen;
