import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text, Image, Linking, ScrollView } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { fetchNearbyPlaces, fetchPlaceDetails } from "../services/locationService";
import { Card, Button, Dialog, Portal, RadioButton, Provider } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("Pharmacy");

  const placeTypes = [
    { label: "Pharmacy", value: "Pharmacy" },
    { label: "Hospital", value: "Hospital" },
    { label: "Clinic", value: "Clinic" },
  ];

  useEffect(() => {
    loadLocationAndPlaces();
  }, [selectedType]);

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

  const handleMarkerPress = async (placeId) => {
    const placeDetails = await fetchPlaceDetails(placeId);
    setSelectedPlace(placeDetails);
  };

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
    return <View style={styles.loadingContainer}><Text>{errorMsg || "Fetching location..."}</Text></View>;
  }

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        <View style={styles.dialogContainer}>
          <Button onPress={showDialog} mode="contained" style={styles.menuButton}>
            {selectedType}
          </Button>
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
        </View>

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
              onPress={() => handleMarkerPress(place.place_id)}
              pinColor="red"
            />
          ))}
        </MapView>

        {selectedPlace && (
          <ScrollView style={styles.cardContainer}>
            <Card style={styles.card}>
              {selectedPlace.photos && selectedPlace.photos.length > 0 && (
                <Image
                  source={{
                    uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${selectedPlace.photos[0].photo_reference}&key=${process.env.EXPO_PUBLIC_mapsApiKey}`,
                  }}
                  style={styles.placeImage}
                  resizeMode="cover"
                />
              )}
              <Card.Content>
                <Text style={styles.placeName}>{selectedPlace.name}</Text>
                <Text style={styles.address}>{selectedPlace.formatted_address}</Text>
                {selectedPlace.rating && (
                  <Text style={styles.rating}>Rating: {selectedPlace.rating}</Text>
                )}
                {selectedPlace.formatted_phone_number && (
                  <Text style={styles.phone}>Phone: {selectedPlace.formatted_phone_number}</Text>
                )}
                {selectedPlace.opening_hours && selectedPlace.opening_hours.weekday_text && (
                  <>
                    <Text style={styles.sectionTitle}>Opening Hours:</Text>
                    {selectedPlace.opening_hours.weekday_text.map((day, index) => (
                      <Text key={index} style={styles.openingHoursText}>{day}</Text>
                    ))}
                  </>
                )}
                {selectedPlace.website && (
                  <Button
                    onPress={() => Linking.openURL(selectedPlace.website)}
                    style={styles.websiteButton}
                    mode="contained"
                  >
                    Visit Website
                  </Button>
                )}
              </Card.Content>
              <Button
                onPress={() => setSelectedPlace(null)}
                style={styles.closeButton}
                mode="outlined"
              >
                Close
              </Button>
            </Card>
          </ScrollView>
        )}
      </SafeAreaView>
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
  cardContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 10,
    elevation: 5,
  },
  card: {
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  placeImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  placeName: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 5,
    color: "#4CAF50",
  },
  address: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  rating: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  phone: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  sectionTitle: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  openingHoursText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#666",
  },
  websiteButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
  },
  closeButton: {
    marginTop: 10,
    borderColor: "#4CAF50",
    marginHorizontal: 10,
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
