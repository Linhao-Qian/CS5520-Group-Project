import React, { useState } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Image, ScrollView, Text } from "react-native";
import { TextInput, Card, IconButton, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { addOrUpdateRecoveryRecord, uploadImageToStorage, deleteImageFromStorage } from "../services/firestoreHelper";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../styles/styles";

const AddRecoveryRecord = ({ navigation, route }) => {
  const recordToEdit = route.params?.record || null;

  const [diseaseName, setDiseaseName] = useState(recordToEdit?.diseaseName || "");
  const [symptoms, setSymptoms] = useState(recordToEdit?.symptoms || "");
  const [startDate, setStartDate] = useState(recordToEdit?.startDate ? new Date(recordToEdit.startDate) : new Date());
  const [notes, setNotes] = useState(recordToEdit?.notes || "");
  const [photos, setPhotos] = useState(recordToEdit?.photos || []);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const handleChoosePhoto = () => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        {
          text: "Choose from Gallery",
          onPress: handlePickImageFromGallery,
        },
        {
          text: "Take Photo",
          onPress: handleTakePhoto,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handlePickImageFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "You need to grant camera roll permissions to select an image.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({ base64: false });
    if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
      const selectedImageUri = pickerResult.assets[0].uri;
      handleUploadImage(selectedImageUri);
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Denied", "You need to grant camera permissions to take a photo.");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({ base64: false });
    if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
      const capturedImageUri = pickerResult.assets[0].uri;
      handleUploadImage(capturedImageUri);
    }
  };

  const handleUploadImage = async (imageUri) => {
    try {
      const { downloadURL, storagePath } = await uploadImageToStorage(imageUri);
      setPhotos((prevPhotos) => [...prevPhotos, { downloadURL, storagePath }]);
    } catch (error) {
      Alert.alert("Upload Failed", "Failed to upload image. Please try again.");
    }
  };

  const handleDeletePhoto = (photo) => {
    Alert.alert("Delete Photo", "Are you sure you want to delete this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteImageFromStorage(photo.storagePath);
            setPhotos((prevPhotos) => prevPhotos.filter((p) => p.storagePath !== photo.storagePath));
          } catch (error) {
            Alert.alert("Error", "Failed to delete the photo from storage.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleSaveRecord = async () => {
    if (!diseaseName || !symptoms || !startDate) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const recordData = {
      diseaseName,
      symptoms,
      startDate: startDate.toISOString(),
      notes,
      photos,
      id: recordToEdit ? recordToEdit.id : null,
    };

    try {
      await addOrUpdateRecoveryRecord(recordData);
      Alert.alert("Success", "Record saved.");
      navigation.goBack();
    } catch (error) {
      console.error("Error saving record:", error);
      Alert.alert("Error", "Failed to save the record.");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    setStartDate(selectedDate);
    hideDatePicker();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Disease Name *"
            value={diseaseName}
            onChangeText={setDiseaseName}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TextInput
            label="Symptoms *"
            value={symptoms}
            onChangeText={setSymptoms}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TouchableOpacity onPress={showDatePicker}>
            <TextInput
              label="Start Date *"
              value={startDate ? startDate.toLocaleDateString() : ''}
              mode="outlined"
              style={styles.input}
              editable={false}
              pointerEvents="none"
              theme={{ colors: { primary: colors.primary } }}
              right={<TextInput.Icon name="calendar" />}
            />
          </TouchableOpacity>

          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />

          <TouchableOpacity onPress={handleChoosePhoto} style={styles.addPhotoContainer}>
            <IconButton
              icon="camera-plus"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>

          <View style={styles.photoContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo.downloadURL }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDeletePhoto(photo)}
                >
                  <MaterialIcons name="cancel" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleSaveRecord}
            style={styles.saveButton}
          >
            Save
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </Card.Content>
      </Card>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
    paddingVertical: 20,
  },
  input: {
    marginBottom: 15,
  },
  addPhotoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'center',
  },
  addPhotoText: {
    color: colors.primary,
    fontSize: 16,
  },
  photoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  photoWrapper: {
    position: "relative",
    margin: 5,
  },
  photo: {
    width: 95,
    height: 95,
    borderRadius: 5,
  },
  deleteIcon: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "white",
    borderRadius: 12,
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
  },
  cancelButton: {
    marginTop: 10,
    borderColor: colors.primary,
  },
});

export default AddRecoveryRecord;
